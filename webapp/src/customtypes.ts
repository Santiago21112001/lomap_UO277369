export type UserInSession = {
  webId?: string;
  name: string;
  imageUrl?: string;
  email?: string;
  friends?: string[];
};

export type PointMarker = {
  id: string
  name: string;
  lat:number;
  lon:number;
  cat:string;
  score:number;
  comment:string;
  image:string;
};

export type UserScore = {
  addedPointMarkersScore:number;
}