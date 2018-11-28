// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Calculator.css';
import routes from '../constants/routes';

type Props = {
  allDigits: Array,
};

// todo
// Handle operation
// Handle = sign
// Handle if decimal pressed
// clear, then all clear
// handle +/-
// handle +/-

export default class Counter extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      digitToDisplay: 0,
      currentDigit: '',
      priorDigit: '',
      runningSum: '',
      lastKeypressType: '',
      currentOperation: '',
      priorOperation: '',
    };

    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleDigitInput = this.handleDigitInput.bind(this);
    this.addNewDigitToCurrentDigit = this.addNewDigitToCurrentDigit.bind(this);
    this.performOperation = this.performOperation.bind(this);
    this.resetSettings = this.resetSettings.bind(this);
    this.completeOrderOfOps = this.completeOrderOfOps.bind(this);
    this.setupOrderofOps = this.setupOrderofOps.bind(this);
    this.isHigherOrderOp = this.isHigherOrderOp.bind(this);
    this.isLowerOrderOp = this.isLowerOrderOp.bind(this);
  }

  componentDidMount() {
    this.resetSettings();
  }

  resetSettings() {
    this.setState({
      digitToDisplay: 0,
      currentDigit: '',
      priorDigit: '',
      runningSum: '',
      lastKeypressType: '',
      currentOperation: '',
      priorOperation: '',
    });
  }

  handleButtonPress(e, button) {
    e.preventDefault();
    e.stopPropagation();

    switch (true) {
      case this.props.allDigits.indexOf(button) > -1:
        this.handleDigitInput(button);
        return;
      case this.props.allOperations.indexOf(button) > -1:
        if (this.state.lastKeypressType === 'operation') {
          this.setState({ currentOperation: button });
        } else {
          if (this.canCompletePriorOrderOfOps()) {
            this.completeOrderOfOps(button);
          } else if (this.requiresOrderOfOperations(button)) {
            this.setupOrderofOps(button);
          } else {
            this.handleOperationInput(button)  
          }
        }
        return;
    }
  }

  completeOrderOfOps(operationStr) {
    var resultOfHigherOrderOfOp = this.performOperation(
      this.state.currentOperation,
      this.state.priorDigit,
      this.state.currentDigit
    )

    var resultOfLowerOrderOfOp = this.performOperation(
      this.state.priorOperation,
      this.state.runningSum,
      resultOfHigherOrderOfOp
    )

    this.setState({
      digitToDisplay: resultOfLowerOrderOfOp,
      runningSum: resultOfLowerOrderOfOp,
      currentDigit: 0,
      priorDigit: '',
      priorOperation: '',
      currentOperation: operationStr,
      lastKeypressType: 'operation',
    })    
  }

  canCompletePriorOrderOfOps() {
    return this.state.currentDigit &&
      this.state.priorDigit &&
      this.state.currentOperation &&
      this.state.priorOperation;
  }

  isHigherOrderOp(operationStr) {
    return ['*', '/'].indexOf(operationStr) > -1;
  }

  isLowerOrderOp(operationStr) {
    return ['+', '-'].indexOf(operationStr) > -1;
  }  

  requiresOrderOfOperations(operationStr) {
    return this.isHigherOrderOp(operationStr) && 
      this.isLowerOrderOp(this.state.currentOperation);
  }

  setupOrderofOps(operationStr) {
    this.setState({
      priorDigit: this.state.currentDigit,
      priorOperation: this.state.currentOperation
    }, function() {
      this.setState({
        currentDigit: 0,
        currentOperation: operationStr
      })
    });  
  }

  performOperation(operationStr, firstNum, secondNum) {
    switch (operationStr) {
      case '+':
        return firstNum + secondNum;
      case '*':
        return firstNum * secondNum;
      case '/':
        return firstNum / secondNum;
      case '-':
        return firstNum - secondNum;        
    }
  };

  handleOperationInput(operationStr) {
    this.setState({lastKeypressType: 'operation'});

    if (!this.state.currentOperation) {
      this.setState({ currentOperation: operationStr })
      return;
    }

    if (operationStr === '=') {
      if (this.state.currentOperation && this.currentOperation !== '=') {
        this.handleOperationInput(this.state.currentOperation);
      }
    } else {
      const newSum = this.performOperation(
        this.state.currentOperation,
        this.state.runningSum,
        this.state.currentDigit
      )

      this.setState({
        runningSum: newSum,
        digitToDisplay: newSum,
        currentOperation: operationStr
      })      
    }

    // switch (operationStr) {
    //   case '+':
    //     const newSum = this.performOperation(
    //       this.state.currentOperation,
    //       this.state.runningSum,
    //       this.state.currentDigit
    //     )

    //     this.setState({
    //       runningSum: newSum,
    //       digitToDisplay: newSum,
    //       currentOperation: operationStr
    //     })

    //     return;
    //   case '*':
    //     const newMultiplyResult = this.performOperation(
    //       this.state.currentOperation,
    //       this.state.runningSum,
    //       this.state.currentDigit
    //     )

    //     this.setState({
    //       runningSum: newMultiplyResult,
    //       digitToDisplay: newMultiplyResult,
    //       currentOperation: operationStr
    //     })
    //     return;
    //   // case '-':
    //   //   this.setState({
    //   //     currentDigit: this.state.currentDigit - this.state.runningSum,
    //   //     priorDigit: 0,
    //   //     currentOperation: operationStr
    //   //   });
    //   //   return;  
    //   // case '/':
    //   //   this.setState({
    //   //     currentDigit: this.state.currentDigit / this.state.runningSum,
    //   //     priorDigit: 0,
    //   //     currentOperation: operationS tr
    //   //   });
    //   //   return;                
    //   case '=':

    //     return;

    // }

  }


  handleDigitInput(newDigit) {
    if (this.state.lastKeypressType === 'operation') {
      if (!this.state.runningSum) {
        this.setState({
          lastKeypressType: 'digit',
          runningSum: this.state.currentDigit,
          currentDigit: 0,
        }, function() {
          this.addNewDigitToCurrentDigit(newDigit);
        })        
      } else {
        this.setState({
          lastKeypressType: 'digit',
          currentDigit: 0,
        }, function() {
          this.addNewDigitToCurrentDigit(newDigit);
        })
      }


    } else {
      this.setState({ lastKeypressType: 'digit' }, function() {
        this.addNewDigitToCurrentDigit(newDigit);  
      });
    }    
  } 

  addNewDigitToCurrentDigit(newDigit) {
    const newDigitAsStr = String(newDigit);
    const newDigitStr = String(this.state.currentDigit) + newDigitAsStr
    const newDigitNum = parseFloat(newDigitStr);
    this.setState({ currentDigit: newDigitNum }, function() {
      this.setState({ digitToDisplay: this.state.currentDigit });
    })
  } 

  static defaultProps = {
    allDigits: [0,1,2,3,4,5,6,7,8,9],
    allOperations: ['+', '*', '/', '-', '=']
  }

  render() {
    const {
      allDigits,
      allOperations,
    } = this.props;

    const { currentDigit } = this.state;

    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>

          <div className={styles.calcWrap}>

            <div>
              <input type="number"
                className={styles.inputDisplay}
                ref="digitDisplay" 
                value={this.state.digitToDisplay} 
                disabled />
            </div>

            <div>
              <button key="AC"
                onClick={(e) => this.resetSettings() }>
                AC
              </button>
            </div>

            {allDigits.map(digit => 
              <button key={digit}
                onClick={(e) => this.handleButtonPress(e, digit) }>
                {digit}
              </button>
            )}

            <div>
              {allOperations.map(operation => 
                <button key={operation}
                  onClick={(e) => this.handleButtonPress(e, operation) }>
                  {operation}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }
}
