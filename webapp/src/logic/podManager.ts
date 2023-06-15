import {
  getSolidDataset,
  getStringNoLocale,
  getThing,
  Thing,
} from "@inrupt/solid-client";
import { FOAF } from "@inrupt/vocab-common-rdf";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { PointMarker, UserInSession } from "../customtypes";
import { getDefaultSession, login, Session } from "@inrupt/solid-client-authn-browser";
import { checkIsNotEmpty } from "./validator";

const basePointMarkersURL : string = "/private/lomap_UO277369/points.json";

async function goToPODLoginPage(session: Session, providerUrl: string): Promise<void> {
  if (!session.info.isLoggedIn) {
    await login({
      oidcIssuer: encodeURI(providerUrl),
      redirectUrl: window.location.href,
      clientName: "lomap"
    })
  }
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
async function getPODUserProfileInfo(webId: string): Promise<UserInSession> {
  const profileUrl: string = getUserProfileUrl(webId) + "#me";
  const userDataset = await getSolidDataset(profileUrl, { fetch: fetch });
  const thing = getThing(userDataset, profileUrl) as Thing;

  return {
    name: getStringNoLocale(thing, FOAF.name),
  } as UserInSession;
};

// ----------------------------
// Métodos privados

/**
 * Devuelve la URL del perfil de un usuario.
 * @param myWedId WebId del usuario.
 * @returns
 */
function getUserProfileUrl(myWedId?: string) : string {
  let webId: string = getDefaultSession().info.webId as string;
  return constructPODUrl(myWedId ?? webId, "/profile/card");
};

function constructPODUrl(webId: string, path: string) : string {
  checkIsNotEmpty(webId);
  checkIsNotEmpty(path);
  return `https://${getWebIdFromUrl(webId)}${path}`;
};

/**
 * Formato de entrada: https://<webId>/profile/card#me
 * Formato de salida: <webId>
 * @param url
 * @returns
 */
function getWebIdFromUrl(url: string): string {
  const webId = url.split("/")[2];
  return webId;
};

const findAllUserPoints = async (webId: string): Promise<PointMarker[]> => {
  const profileDocumentURI = encodeURI(getUserPrivatePointsUrl(webId));

  try {
    const data = await fetch(profileDocumentURI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return parseJsonToPoint(await data.json());
  } catch (err) {}
  return new Array<PointMarker>();
};
const parseJsonToPoint = (inData: any): PointMarker[] => {
  const newPoints: PointMarker[] = [];
  const { points } = inData;

  points.forEach((item: any) => {
    const {
      name,
      lat,
      lon
    } = item;
    let pointMarker:PointMarker = {name, lat, lon};
    newPoints.push(pointMarker);
  });

  return newPoints;
};
const getUserPrivatePointsUrl = (myWedId?: string) => {
  let webId: string = getDefaultSession().info.webId as string;
  return constructPODUrl(myWedId ?? webId, basePointMarkersURL);
};

export { getPODUserProfileInfo, getUserProfile, goToPODLoginPage, findAllUserPoints };