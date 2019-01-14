var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Star = (props) => {
	// const numOfStars = 1 + Math.floor(Math.random() * 9)
	return (
  	<div className="col-5">
    	{_.range(props.numOfStars).map((i) => <i className="fa fa-star" key={i}></i>)}
    </div>
  )
}

const Button = (props) => {
	let button 
  switch(props.answerIsCorrect) {
  	case true:
    	button = <button className="btn btn-success" onClick={props.acceptAnswer}>
    	  <i className='fa fa-check'></i>
    	</button>
    break;
    case false:
    	button = <button className="btn btn-danger">
    	  <i className='fa fa-times'></i>
    	</button>
    break;
    default:
    	button = <button className="btn btn-secondary btn-lg" disabled={props.selectedNumbers.length < 1} 
      				onClick={() => props.onSubmit()}>=</button>
    break
  }
  
	return (
  	<div className="col-2 text-center">
      {button}
      <br />
      <br />
      <button className="btn btn-warning btn-sm" 
      				onClick={props.redraw}
              disabled={props.redraws === 0}>
        <i className="fa fa-recycle"></i> {props.redraws}
      </button>
    </div>
  )
}

const Answer = (props) => {
	return (
  	<div className="col-5">
    	{props.selectedNumbers.map((num, i) => 
      	<span key={i} onClick={() => props.onSelect(num)} >
        	{num}
        </span>)}
    </div>
  )
}

const Numbers = (props) => {  
	const numberClassName = (num) => {
  	if(props.usedNumbers.indexOf(num) >= 0)
    	return 'used'
  	if(props.selectedNumbers.indexOf(num) >= 0)
    	return 'selected'
  }
	
	return(
  	<div className="card text-center">
      	<div>
        	{Numbers.list.map((num, i) => 
             <span key={i} className={numberClassName(num)} 
             				onClick={() => props.onSelect(num)} >
                {num}
             </span>
          )}
        </div>
    </div>
  )
}
Numbers.list = _.range(1,10)

const DoneFrame = (props) => {
	return(
  	<div className='text-center'>
    	<h3>{props.doneStatus}</h3>
      <button className="btn btn-primary btn-lg" onClick={props.resetGame}>Play Again</button>
    </div>
  )
}


class Game extends React.Component {
	static randomNum = () => 1 + Math.floor(Math.random() * 9)
  static setInit = () => ({
  	selectedNumbers: [],
    randomNumOfStars: Game.randomNum(),
    usedNumbers: [],
    redraws: 5,
    answerIsCorrect: null,
    doneStatus: null
  })
  
	state = Game.setInit()
  
  resetGame = () => {
  	this.setState(Game.setInit())
  }
  
  selectNumber = (num) => {
  	if(this.state.selectedNumbers.indexOf(num) >= 0)
    	return;
  	this.setState((prevState) => ({
    	selectedNumbers: prevState.selectedNumbers.concat(num),
      answerIsCorrect: null
    }))
  }
  
  removeNumber = (num) => {
  	this.setState((prevState) => ({
    	selectedNumbers: prevState.selectedNumbers
      													.filter(currVal => num != currVal),
      answerIsCorrect: null            
    }))
  }
  
  checkAnswer = () => {
  	this.setState((prevState) => ({
    	answerIsCorrect: prevState.randomNumOfStars ===
      						prevState.selectedNumbers.reduce((accumulator, currentValue) => accumulator + currentValue)
    }))
  }
  
  acceptAnswer = () => {
  	this.setState((prevState) => ({
      usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      answerIsCorrect: null,
      selectedNumbers: [],
      randomNumOfStars: Game.randomNum()
    }), this.updateDoneStatus)
  }
  
  redraw = () => {
  	if(this.state.redraws === 0) return
  	this.setState((prevState) => ({
    	answerIsCorrect: null,
      randomNumOfStars: Game.randomNum(),
      selectedNumbers: [],
      redraws: prevState.redraws - 1
    }), this.updateDoneStatus)
  }
  
  possibleSolution = ({randomNumOfStars, usedNumbers}) => {
  	const possibleNumbers = _.range(1,10).filter(num => usedNumbers.indexOf(num) < 0)
    return possibleCombinationSum(possibleNumbers, randomNumOfStars)
  }
  
  updateDoneStatus = () => {
  	this.setState((prevState) => {
    	if(prevState.usedNumbers.length === 9)
      	return {doneStatus: 'Done. Nice!'}
      if(prevState.redraws === 0 && !this.possibleSolution(prevState))
      	return {doneStatus: 'Game Over!'}
    })
  }
  	
	render() {
  	return(
    	<div>
      	<h3>Play Nine</h3>
        <hr/>
      	<div className="row">
          <Star numOfStars={this.state.randomNumOfStars}/>
          <Button selectedNumbers={this.state.selectedNumbers} 
          				onSubmit={this.checkAnswer} 
          				answerIsCorrect={this.state.answerIsCorrect}
                  acceptAnswer={this.acceptAnswer}
                  redraw={this.redraw}
                  redraws={this.state.redraws}/>
          <Answer selectedNumbers={this.state.selectedNumbers} 
          				onSelect={this.removeNumber}/>
        </div>
        <br/>
        { this.state.doneStatus ? 
             <DoneFrame doneStatus={this.state.doneStatus}
             						resetGame={this.resetGame} /> :
             <Numbers selectedNumbers={this.state.selectedNumbers} 
             onSelect={this.selectNumber} 
             usedNumbers={this.state.usedNumbers}/> 
        }
      </div>
    )
  }
}

class App extends React.Component {
	render() {
  	return (
    	<Game />
    )
  }
}

ReactDOM.render(<App />, mountNode);