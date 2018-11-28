import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Calculator from '../components/Calculator';
import * as CalculatorActions from '../actions/calculator';

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CalculatorActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Calculator);
