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
};