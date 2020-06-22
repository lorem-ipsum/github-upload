const Square = props => {
  return (
    React.createElement("button", {
      className: "square",
      onClick: props.onClick,
      key: props.i,
      iswinning: props.isWinning },

    props.value));


};

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: props.size
      // winningSeq: props.winningSeq
    };
  }

  renderSquare(i) {
    // console.log("In renderSQUARE", this.props.winningSeq)
    return (
      React.createElement(Square, {
        value: this.props.squares[i],
        onClick: () => this.props.onClick(i),
        key: i,
        isWinning:
        this.props.winningSeq && this.props.winningSeq.indexOf(i) !== -1 ?
        "true" :
        "false" }));



  }

  renderARow(i) {
    let arr = [];
    for (let j = 0; j < this.state.size; ++j) {
      arr.push(j);
    }
    return (
      React.createElement("div", { className: "board-row", key: i },
      arr.map((v, j) => this.renderSquare(i * this.state.size + j))));


  }

  render() {
    let arr = [];
    for (let j = 0; j < this.state.size; ++j) {
      arr.push(j);
    }

    return React.createElement("div", null, arr.map((v, j) => this.renderARow(j)));
  }}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      size: this.props.size,
      history: [
      {
        squares: Array(this.props.size * this.props.size).fill(null) }],


      stepNumber: 0,
      xIsNext: true,
      historyPoints: { seq: [NaN], cur: 1 }
      // winningSeq: []
    };
  }

  calculateWinner(size, squares) {
    for (let t = 0; t < size * size; ++t) {
      if (
      squares[t] &&
      t % size + 4 < size &&
      squares[t] === squares[t + 1] &&
      squares[t] === squares[t + 2] &&
      squares[t] === squares[t + 3] &&
      squares[t] === squares[t + 4])
      {
        return [squares[t], [t, t + 1, t + 2, t + 3, t + 4]];
      }
      if (
      squares[t] &&
      Math.floor(t / size) + 4 < size &&
      squares[t] === squares[t + size] &&
      squares[t] === squares[t + 2 * size] &&
      squares[t] === squares[t + 3 * size] &&
      squares[t] === squares[t + 4 * size])
      {
        return [
        squares[t],
        [t, t + size, t + 2 * size, t + 3 * size, t + 4 * size]];

      }
      if (
      squares[t] &&
      t % size + 4 < size &&
      Math.floor(t / size) + 4 < size &&
      squares[t] === squares[t + size + 1] &&
      squares[t] === squares[t + 2 * (size + 1)] &&
      squares[t] === squares[t + 3 * (size + 1)] &&
      squares[t] === squares[t + 4 * (size + 1)])
      {
        return [
        squares[t],
        [
        t,
        t + size + 1,
        t + 2 * (size + 1),
        t + 3 * (size + 1),
        t + 4 * (size + 1)]];


      }
      if (
      squares[t] &&
      t % size - 4 >= 0 &&
      Math.floor(t / size) + 4 < size &&
      squares[t] === squares[t + size - 1] &&
      squares[t] === squares[t + 2 * (size - 1)] &&
      squares[t] === squares[t + 3 * (size - 1)] &&
      squares[t] === squares[t + 4 * (size - 1)])
      {
        return [
        squares[t],
        [
        t,
        t + size - 1,
        t + 2 * (size - 1),
        t + 3 * (size - 1),
        t + 4 * (size - 1)]];


      }
    }
    return null;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(this.state.size, squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "●" : "○";
    this.setState({
      historyPoints: {
        seq: this.state.historyPoints.seq.
        slice(0, this.state.stepNumber + 1).
        concat(i),
        cur: this.state.historyPoints.cur + 1 },

      history: history.concat([{ squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext });

  }

  jumpTo(step) {
    this.setState(() => ({
      historyPoints: { seq: this.state.historyPoints.seq.slice(), cur: step },
      stepNumber: step,
      xIsNext: step % 2 === 0 }));

  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerDesc = this.calculateWinner(this.state.size, current.squares);
    const winner = winnerDesc ? winnerDesc[0] : null;
    const winningSeq = winnerDesc ? winnerDesc[1] : null;

    const moves = history.map((step, move) => {
      const hpsm = this.state.historyPoints.seq[move];
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        React.createElement("li", { key: move },
        React.createElement("button", {
          onClick: () => this.jumpTo(move),
          className: "btn btn-sm btn-outline-secondary mt-1" },

        desc),

        !isNaN(hpsm) && move <= this.state.historyPoints.cur &&
        React.createElement("small", { className: "text-muted d-inline ml-2" },
        " ",
        move % 2 ? "●" : "○", " (", Math.floor(hpsm / this.state.size) + 1, ",", " ",
        hpsm % this.state.size + 1, ")")));




    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber < this.state.size * this.state.size) {
      status = "Next player: " + (this.state.xIsNext ? "●" : "○");
    } else {
      status = "Draw";
    }

    winningSeq && console.log("winningSeq", winningSeq);

    return (
      React.createElement("div", { className: "container" },
      React.createElement("h1", { className: "display-4 text-center my-5" }, "five-in-a-row"),
      React.createElement("div", { className: "game" },
      React.createElement("div", { className: "game-board" },
      React.createElement(Board, {
        squares: current.squares,
        onClick: i => this.handleClick(i),
        size: this.state.size,
        winningSeq: winningSeq })),


      React.createElement("div", { className: "game-info ml-5" },
      React.createElement("div", { className: "h4 ml-4" }, status),
      React.createElement("ul", null, moves)))));




  }}


ReactDOM.render(
React.createElement(React.StrictMode, null,
React.createElement(Game, { size: 9 })),

document.getElementById("root"));