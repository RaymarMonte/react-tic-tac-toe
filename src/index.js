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
            <Square key={[x, y]}
                value={this.props.squares[x][y]}
                onClick={() => this.props.onClick(x, y)}
            />
        );
    }

    render() {
        let rows = [];
        for (let i = 0;i < 3;i++) {
            let cols = [];
            for (let j = 0;j < 3;j++) {
                cols.push(this.renderSquare(i, j));
            }
            rows.push(<div key={i} className="board-row">{cols}</div>);
        }

        return (
            <div>{rows}</div>
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
            isAscending: true,
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

    handleSwapOrderClick() {
        this.setState({
            isAscending: !this.state.isAscending,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        let history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        if (!this.state.isAscending) {
            history = history.slice().reverse();
        }
        const moves = history.map((step, index) => {
            const move = this.state.isAscending ? index : history.length - index - 1;
            const desc = move ?
                `Go to move #: ${move} (${step.posX}, ${step.posY})` :
                'Go to game start';
            const selected = this.state.stepNumber === move ? 'selected' : '';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className={selected}>
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
                    <div><button onClick={() => this.handleSwapOrderClick()}>Swap Order</button></div>
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