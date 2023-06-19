import {
  getSolidDataset,
  getStringNoLocale,
  getThing,
  Thing,
} from "@inrupt/solid-client";
import { FOAF } from "@inrupt/vocab-common-rdf";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { PointMarker, User, UserScore } from "../customtypes";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import { checkIsNotEmpty } from "./validator";
import { overwriteFile, getSourceUrl } from "@inrupt/solid-client";

const basePointMarkersURL: string = "/private/lomap_UO277369/points.json";
const baseUserScoreURL: string = "/private/lomap_UO277369/score.json";

async function goToPODLoginPage(session: Session, providerUrl: string): Promise<void> {
  if (!session.info.isLoggedIn) {
    await session.login({
      oidcIssuer: encodeURI(providerUrl),
      redirectUrl: window.location.href,
      clientName: "lomap"
    })
  }
}

async function logoutFromPOD(session: Session): Promise<void> {
  await session.logout();
}

async function getUserProfile(webId: string) {
  const userDataset = await getSolidDataset(webId, { fetch: fetch });
  const thing = getThing(userDataset, webId) as Thing;
  return thing;
};

/**
 * Obtener la información del perfil del usuario en sesión.
 * @param webId
 */
async function getPODUserProfileInfo(webId: string): Promise<User> {
  const profileUrl: string = getUserProfileUrl(webId) + "#me";
  const userDataset = await getSolidDataset(profileUrl, { fetch: fetch });
  const thing = getThing(userDataset, profileUrl) as Thing;

  return {
    name: getStringNoLocale(thing, FOAF.name),
    webId
  } as User;
};

const findAllUserPoints = async (webId: string): Promise<PointMarker[]> => {
  const url = encodeURI(getUserPrivatePointsUrl(webId));

  try {
    const data = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return parseJsonToPoint(await data.json());
  } catch (err) { }
  return new Array<PointMarker>();
};

async function addUserPoint(newPoint: PointMarker, webId: string, fetch: any): Promise<void> {
  const url = encodeURI(getUserPrivatePointsUrl(webId));
  let userPoints: PointMarker[] = await findAllUserPoints(webId);
  userPoints.push(newPoint);
  let file = new Blob([JSON.stringify({ points: userPoints })], { type: "application/json", })
  await writeFileToPod(file, url, fetch);
  await addUserScore(5, webId, fetch);
}

// ----------------------------
// Métodos privados

function getUserScoreUrl(myWedId?: string): string {
  let webId: string = getDefaultSession().info.webId as string;
  return constructPODUrl(myWedId ?? webId, baseUserScoreURL);
};
async function addUserScore(scoreAdded: number, webId: string, fetch: any): Promise<void> {
  const url = encodeURI(getUserScoreUrl(webId));
  let userScore: UserScore = await getUserScoreFromPOD(webId);
  userScore.addedPointMarkersScore += scoreAdded;
  let file = new Blob([JSON.stringify(userScore)], { type: "application/json", })
  await writeFileToPod(file, url, fetch);
}
async function addSharedPointsUserScore(scoreAdded: number, webId: string, fetch: any): Promise<void> {
  const url = encodeURI(getUserScoreUrl(webId));
  let userScore: UserScore = await getUserScoreFromPOD(webId);
  userScore.sharedPointMarkersScore += scoreAdded;
  let file = new Blob([JSON.stringify(userScore)], { type: "application/json", })
  await writeFileToPod(file, url, fetch);
}

async function getUserScoreFromPOD(webId: string): Promise<UserScore> {
  const url = encodeURI(getUserScoreUrl(webId));
  try {
    const data = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return parseJsonToScore(await data.json());
  } catch (err) { }
  return { addedPointMarkersScore: 0, sharedPointMarkersScore: 0 };
}
function parseJsonToScore(inData: any): UserScore {
  const { addedPointMarkersScore, sharedPointMarkersScore } = inData;
  return { addedPointMarkersScore, sharedPointMarkersScore };
}
// Upload data as a file to the targetFileURL.
// If the targetFileURL exists, overwrite the file.
// If the targetFileURL does not exist, create the file at the location.
async function writeFileToPod(filedata: Blob, targetFileURL: string, fetch: any): Promise<void> {
  try {
    const savedFile = await overwriteFile(
      targetFileURL,                   // URL for the file.
      filedata,                        // Buffer containing file data
      { contentType: "application/json", fetch: fetch } // mimetype if known, fetch from the authenticated session
    );
    console.log(`File saved at ${getSourceUrl(savedFile)}`);
  } catch (error) {
    console.error(error);
  }
}


/**
 * Devuelve la URL del perfil de un usuario.
 * @param myWedId WebId del usuario.
 * @returns
 */
function getUserProfileUrl(myWedId?: string): string {
  let webId: string = getDefaultSession().info.webId as string;
  return constructPODUrl(myWedId ?? webId, "/profile/card");
};

function constructPODUrl(webId: string, path: string): string {
  checkIsNotEmpty(webId);
  checkIsNotEmpty(path);
  return `https://${getWebIdFromUrl(webId)}${path}`;
};

/**
 * @param url https://webId/profile/card#me
 * @returns webId
 */
function getWebIdFromUrl(url: string): string {
  const webId = url.split("/")[2];
  return webId;
};

const parseJsonToPoint = (inData: any): PointMarker[] => {
  const newPoints: PointMarker[] = [];
  const { points } = inData;

  points.forEach((item: any) => {
    const {
      id,
      name,
      lat,
      lon,
      cat,
      score,
      comment,
      image,
      yours,
      friend,
      sharedWith
    } = item;
    let pointMarker: PointMarker = { id, name, lat, lon, cat, score, comment, image, yours, friend,sharedWith };
    newPoints.push(pointMarker);
  });

  return newPoints;
};
const getUserPrivatePointsUrl = (myWedId?: string) => {
  let webId: string = getDefaultSession().info.webId as string;
  return constructPODUrl(myWedId ?? webId, basePointMarkersURL);
};

export { addSharedPointsUserScore, getPODUserProfileInfo, getUserProfile, goToPODLoginPage, findAllUserPoints, addUserPoint, getUserScoreFromPOD, getUserProfileUrl, getWebIdFromUrl, parseJsonToPoint, writeFileToPod, constructPODUrl, logoutFromPOD };



