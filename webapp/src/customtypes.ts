export type User = {
  webId: string;
  name: string;
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
  yours:boolean;
  friend?:Friend;
  sharedWith:Friend[];
};

export type UserScore = {
  addedPointMarkersScore:number;
  sharedPointMarkersScore:number;
};

export type Friend = {
  webId : string;
  name : string;
};
