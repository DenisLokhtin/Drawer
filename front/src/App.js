import './App.css';
import React, {useState, useRef, useEffect} from 'react';

const App = () => {

    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/draw');
    }, []);

    const [state, setState] = useState({
        mouseDown: false,
        pixelsArray: []
    });

    const [color, setColor] = useState('black');
    const [radius, setRadius] = useState(10);

    const sendData = {
        axis: state.pixelsArray,
        radius: radius,
        color: color
    };

    const send = () => {
        ws.current.send(sendData);
        console.log(sendData)
    };

    const canvas = useRef(null);

    const canvasMouseMoveHandler = event => {
        if (state.mouseDown) {
            event.persist();
            const clientX = event.clientX;
            const clientY = event.clientY;

            setState(prevState => {
                return {
                    ...prevState,
                    pixelsArray: [...prevState.pixelsArray, {
                        x: clientX,
                        y: clientY
                    }]
                };
            });

            const context = canvas.current.getContext('2d');
            context.beginPath();
            context.arc(clientX - 13, clientY - 20, radius, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
        }
    };


    const mouseDownHandler = event => {
        setState({...state, mouseDown: true});
    };


    const mouseUpHandler = event => {
        setState({...state, mouseDown: false, pixelsArray: []});
        send()
    };

    const colorSet = color => {
        setColor(color);
    };


    return (
        <div>
            <canvas
                ref={canvas}
                style={{border: '2px solid black'}}
                width={1600}
                height={900}
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onMouseMove={canvasMouseMoveHandler}
            />
            <div className="container">
                <div className="radius">
                    <span>Radius <button onClick={() => setRadius(radius + 5)}>+</button> <button
                        onClick={() => setRadius(radius - 5)}>-</button> <span>{radius}</span></span>
                </div>
                <div className="colors">
                    <div onClick={event => colorSet(event.target.className)} className="black"/>
                    <div onClick={event => colorSet(event.target.className)} className="white"/>
                    <div onClick={event => colorSet(event.target.className)} className="green"/>
                    <div onClick={event => colorSet(event.target.className)} className="blue"/>
                    <div onClick={event => colorSet(event.target.className)} className="red"/>
                    <div onClick={event => colorSet(event.target.className)} className="yellow"/>
                </div>
            </div>
        </div>
    );

};
export default App;

