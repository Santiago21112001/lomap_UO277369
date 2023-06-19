import {
    Thing,
    addUrl,
    getSolidDataset,
    getStringNoLocale,
    getThing,
    getUrlAll,
    saveSolidDatasetAt,
    setThing} from "@inrupt/solid-client";
import { Friend, PointMarker } from "../customtypes"
import { addSharedPointsUserScore, constructPODUrl, getPODUserProfileInfo, getUserProfile, getUserProfileUrl, parseJsonToPoint, writeFileToPod } from "./podManager";
import { fetch, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { FOAF } from "@inrupt/vocab-common-rdf";

const baseUserSharedPointsURL: string = "/public/lomap_UO277369/shared/";

/**
 * Añade un amigo en caso de no existir ya.
 * @param webId webId del usuario en sesión que quiere añadir un amigo
 * @param friendUsername username del amigo que se quiere añadir (formato: '<username>.<provider>')
 */
async function addFriend(webId: string, friendUsername: string) {
    // Validar que existe el usuario a agregar
    if (!await checkExistsUser(friendUsername)) {
        throw new Error(
            `No existe el usuario = ${friendUsername}`
        );
    }


    try {
        const userInSesionProfileUrl: string = getUserProfileUrl(webId); // Obtiene el webid sin el #me

        let userDataset = await getSolidDataset(userInSesionProfileUrl, {
            fetch: fetch,
        });
        const userInSesionProfile = getThing(userDataset, webId) as Thing;
        if (checkIfExistsFriend(userInSesionProfile, friendUsername)) {
            // ya existe el amigo   
        } else {
            const newFriend = addUrl(
                userInSesionProfile,
                FOAF.knows,
                constructWebIdFromUsername(friendUsername)
            );
            userDataset = setThing(userDataset, newFriend);
            await saveSolidDatasetAt(userInSesionProfileUrl, userDataset, {
                fetch: fetch,
            });
        }
    } catch (error) {
        throw new Error(
            `Error al añadir al amigo, (${error})`
        );
    }

};
async function getAllFriends(webId: string): Promise<Friend[]> {
    const myFriendsList: Friend[] = [];

    try {
        const profileDataset = await getSolidDataset(webId, { fetch: fetch });

        const profile = getThing(profileDataset, webId) as Thing;

        const friends = getUrlAll(profile, FOAF.knows);

        // Recorremos las relaciones obtenidas almacenando los datos de cada amigo
        for (let i = 0; i < friends.length; i++) {
            const friendName = getStringNoLocale(
                await getUserProfile(friends[i]),
                FOAF.name
            ) as string;
            const user: Friend = {
                webId: friends[i],
                name: friendName
            };
            myFriendsList.push(user);
        }
    } catch (error) {
        throw error;
    }

    return myFriendsList;
}

/**
 * Añade el punto a compartir a la carpeta private/sharedpoints/<username> del usuario.
 * <username> es el nombre de usuario del amigo con el que se quiere compartir el punto.
 * @param point Punto que se quiere compartir con el amigo
 * @param session Sesión del usuario logeado en la aplicación
 * @param friend Amigo con el que se quiere compartir el punto dado.
 * @returns 
 */
async function addSharedPointForFriend(newPoint: PointMarker,
    fetch: any,
    friend: Friend) {
    newPoint.yours = false;

    let webId: string = getDefaultSession().info.webId as string;
    let name: string = (await getPODUserProfileInfo(webId)).name;
    newPoint.friend = { name, webId };
    const url = encodeURI(getUserSharedPointsUrl(webId, friend.name));
    let userPoints: PointMarker[] = await findAllSharedUserPoints(url);
    userPoints.push(newPoint);
    let file = new Blob([JSON.stringify({ points: userPoints })], { type: "application/json", });
    await writeFileToPod(file, url, fetch);
    await addSharedPointsUserScore(10, webId, fetch);
    //await allowReadingToFriend(webId, friend,fetch);
}

const findAllSharedUserPoints = async (url: string): Promise<PointMarker[]> => {
    try {
        const data = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return parseJsonToPoint(await data.json());
    } catch (err) { console.log(err); }
    return new Array<PointMarker>();
};
function getUserSharedPointsUrl(myWedId: string, friendName: string) {
    return constructPODUrl(myWedId, baseUserSharedPointsURL) + friendName + "/sharedpoints.json";
}
/**
 * Devuelve un array con todos los puntos que los amigos del usuario en sesión le han
 * compartido
 * @param session Sesion del usuario logeado.
 * @returns Array con los puntos compartidos
 */
async function findAllSharedPointsByFriends(session: any):Promise<PointMarker[]> {
    const userFriends = await getAllFriends(session.info.webId);
    let totalPoints: PointMarker[] = [];
    for (let i = 0; i < userFriends.length; i++) {
        const friend = userFriends[i];
        totalPoints = totalPoints.concat(await findSharedPointsByFriend(session, friend));
    }
    return totalPoints;
}
  
  async function findSharedPointsByFriend(session: any, friend: Friend):Promise<PointMarker[]> {
    const myUserName:string=(await getPODUserProfileInfo(session.info.webId)).name;
    const friendDocumentURI = encodeURI(getUserSharedPointsUrl(friend.webId,myUserName));
    try {
        const data = await session.fetch(friendDocumentURI, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return parseJsonToPoint(await data.json());
    } catch (err) {
        // error
    }
    return new Array<PointMarker>();
}
  
// ------------------
// Métodos privados
function constructWebIdFromUsername(userName: string): string {
    const webId = 'https://' + userName + '/profile/card#me';
    return webId;
}
async function checkExistsUser(friendUsername: string) {
    const friendProfileUrl: string = "https://" + friendUsername + "/profile/card";
    try {
        await getSolidDataset(friendProfileUrl, { fetch: fetch });
        return true;
    } catch (error) {
        console.log("No existe el usuario. " + error);
        return false;
    }


}
function checkIfExistsFriend(userProfile: any, friendUsername: string): boolean {
    const friends = getUrlAll(userProfile, FOAF.knows);
    if (friends.includes(constructWebIdFromUsername(friendUsername))) {
        return true;
    }
    return false;
};

export { addFriend, getAllFriends, addSharedPointForFriend,findAllSharedPointsByFriends };


