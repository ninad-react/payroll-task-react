const Status = ({num}) => {
    let text = "", color= "";
    switch(num){
        case -1:
            text = "Not Accepted"
            color = "red"
            break
        case 0:
            text = "Accepted"
            color = "orange"
            break
        case 100:
            text = "Completed"
            color = "green"
            break
        default:
            text = `Partial Complete (${num}%)`
            color = "blue"
            break
        }
    return <span style={{color: color}}>{text}</span>
}

export default Status;