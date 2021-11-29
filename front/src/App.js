import './App.css';
import React, {useState, useRef, useEffect} from 'react';

const App = () => {

    const ws = useRef(null);
    const canvas = useRef(null);

    const [state, setState] = useState({
        mouseDown: false,
        color: 'black',
        radius: 10,
    });

    const [data, setData] = useState({
        dataObj: [],
        type: 'CREATE_MESSAGE'
    });

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/draw');

        ws.current.onmessage = event => {
            let newData = JSON.parse(event.data)
            console.log(newData.message.dataObj)

            if (canvas !== null || newData || newData.message.dataObj.length !== 0) {
                const context = canvas.current.getContext('2d');
                newData.message.dataObj.map(info => {
                    context.beginPath();
                    context.arc(info.x - 13, info.y - 20, info.radius, 0, 2 * Math.PI, false);
                    context.fillStyle = info.color;
                    return (
                        context.fill()
                    )
                });
            }
        };
    }, []);

    const send = () => {
        ws.current.send(JSON.stringify(data));
    };

    const canvasMouseMoveHandler = event => {
        if (state.mouseDown) {
            event.persist();
            const clientX = event.clientX;
            const clientY = event.clientY;

            setData(prevState => {
                return {
                    ...prevState,
                    dataObj: [...prevState.dataObj, {
                        x: clientX,
                        y: clientY,
                        color: state.color,
                        radius: state.radius
                    }]
                }

            });

            const context = canvas.current.getContext('2d');
            context.beginPath();
            context.arc(clientX - 13, clientY - 20, state.radius, 0, 2 * Math.PI, false);
            context.fillStyle = state.color;
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

    let colorSet = color => {
        setState({...state, color: color});
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
                    <span>
                        Radius
                        <button onClick={() => setState({...state, radius: state.radius + 5})}>+</button>
                        <button onClick={() => setState({...state, radius: state.radius - 5})}>-</button>
                        <span>{state.radius}</span>
                    </span>
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

