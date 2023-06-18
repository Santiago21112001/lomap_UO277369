function PointMarkerImage(props:{imageName:string}) {
    if (props.imageName === null || props.imageName === "Sin imagen" || props.imageName.trim().length === 0) {
        return(<></>);
    }
    let srcSelected:string = "../../photos/"+props.imageName+".png";
    return(<img id="photo" width="100" height="100" src={srcSelected} alt="icono"/>)
}

export default PointMarkerImage;