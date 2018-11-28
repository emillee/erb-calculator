// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
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
      currentDigit: 0,
      priorDigit: 0,
      runningSum: 0,
      lastKeypressType: '',
      currentOperation: '',
      priorOperation: '',
    };

    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleDigitInput = this.handleDigitInput.bind(this);
    this.addNewDigitToCurrentDigit = this.addNewDigitToCurrentDigit.bind(this);
    this.performLastOperation = this.performLastOperation.bind(this);
    this.resetSettings = this.resetSettings.bind(this);
  }

  componentDidMount() {
    this.resetSettings();
  }

  resetSettings() {
    this.setState({
      digitToDisplay: 0,
      currentDigit: 0,
      priorDigit: 0,
      runningSum: 0,
      lastKeypressType: '',
      currentOperation: '',
      priorOperation: '',
    });
  }

  handleButtonPress(button) {
    switch (true) {
      case this.props.allDigits.indexOf(button) > -1:
        this.handleDigitInput(button);
        return;
      case this.props.allOperations.indexOf(button) > -1:
        if (this.state.lastKeypressType === 'operation') {
          this.setState({ currentOperation: button });
        } else {
          this.handleOperationInput(button);  
        }
        return;
    }
  }

  performLastOperation(operationStr) {
    switch (operationStr) {
      case '+':
        return this.state.runningSum + this.state.currentDigit;
      case '*':
        return this.state.runningSum * this.state.currentDigit;
    }
  };

  handleOperationInput(operationStr) {
    this.setState({lastKeypressType: 'operation'});

    if (!this.state.currentOperation) {
      this.setState({ currentOperation: operationStr })
      return;
    }

    switch (operationStr) {
      case '+':
        const newSum = this.performLastOperation(this.state.currentOperation)
        this.setState({
          runningSum: newSum,
          digitToDisplay: newSum,
          currentOperation: operationStr
        })

        return;
      case '*':
        const newMultiplyResult = this.performLastOperation(this.state.currentOperation)
        console.log(newMultiplyResult)

        this.setState({
          runningSum: newMultiplyResult,
          digitToDisplay: newMultiplyResult,
          currentOperation: operationStr
        })
        return;
      // case '-':
      //   this.setState({
      //     currentDigit: this.state.currentDigit - this.state.runningSum,
      //     priorDigit: 0,
      //     currentOperation: operationStr
      //   });
      //   return;  
      // case '/':
      //   this.setState({
      //     currentDigit: this.state.currentDigit / this.state.runningSum,
      //     priorDigit: 0,
      //     currentOperation: operationS tr
      //   });
      //   return;                
      case '=':
        if (this.state.currentOperation && this.currentOperation !== '=') {
          this.handleOperationInput(this.state.currentOperation);
        }
        return;

    }

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
    // '/', '-', 
    allOperations: ['+', '*', '=']
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

          <div>
            <input type="number"
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

          <div>
            {allDigits.map(digit => 
              <button key={digit}
                onClick={(e) => this.handleButtonPress(digit) }>
                {digit}
              </button>
            )}
          </div>

          <div>
            {allOperations.map(operation => 
              <button key={operation}
                onClick={(e) => this.handleButtonPress(operation) }>
                {operation}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
