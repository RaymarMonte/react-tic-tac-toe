import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(x, y) {
        return (
            <Square
                value={this.props.squares[x][y]}
                onClick={() => this.props.onClick(x, y)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0, 0)}
                    {this.renderSquare(0, 1)}
                    {this.renderSquare(0, 2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(1, 0)}
                    {this.renderSquare(1, 1)}
                    {this.renderSquare(1, 2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(2, 0)}
                    {this.renderSquare(2, 1)}
                    {this.renderSquare(2, 2)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(3).fill(Array(3).fill(null)),
                posX: -1,
                posY: -1
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    handleClick(x, y) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        let squares = Array(3).fill(null);
        for (let i = 0;i < current.squares.length;i++) {
            squares[i] = current.squares[i].slice();
        }
        if (calculateWinner(squares) || squares[x][y]) {
            return;
        }
        squares[x][y] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                posX: x,
                posY: y

            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #: ${move} (${step.posX}, ${step.posY})` :
                'Go to game start';
            const selected = this.state.stepNumber === move ? 'selected' : '';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} class={selected}>
                        {desc}
                    </button>
                </li>
            );
        })

        let status;
        if (winner) {
            status = `Winner: ${winner}`;
        }
        else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(x, y) => this.handleClick(x, y)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    for (let i = 0;i < 3;i++) {
        if (squares[i][0] && squares[i][0] === squares[i][1] && squares[i][1] === squares[i][2]) {
            return squares[i][0];
        }
        if (squares[0][i] && squares[0][i] === squares[1][i] && squares[1][i] === squares[2][i]) {
            return squares[0][i];
        }
    }
    if (squares[1][1] && squares[0][0] === squares[1][1] && squares[1][1] === squares[2][2]) {
        return squares[1][1];
    }
    if (squares[1][1] && squares[0][2] === squares[1][1] && squares[1][1] === squares[2][0]) {
        return squares[1][1];
    }
    
    return null;
}