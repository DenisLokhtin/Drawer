import './App.css';
import React, {useState, useRef} from 'react';

const App = () => {

    const [state, setState] = useState({
        mouseDown: false,
        pixelsArray: []
    });

    const [color, setColor] = useState('black');

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
            context.arc(clientX - 13, clientY - 20, 10, 0, 2*Math.PI, false);
            context.fillStyle = color;
            context.fill();
        }
    };


    const mouseDownHandler = event => {
        setState({...state, mouseDown: true});
    };


    const mouseUpHandler = event => {
        setState({...state, mouseDown: false, pixelsArray: []});
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
            <div className="colors">
                <div onClick={event => colorSet(event.target.className)} className="black"/>
                <div onClick={event => colorSet(event.target.className)} className="white"/>
                <div onClick={event => colorSet(event.target.className)} className="green"/>
                <div onClick={event => colorSet(event.target.className)} className="blue"/>
                <div onClick={event => colorSet(event.target.className)} className="red"/>
                <div onClick={event => colorSet(event.target.className)} className="yellow"/>
            </div>
        </div>
    );

};
export default App;

