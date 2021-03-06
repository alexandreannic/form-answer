import * as React from 'react';
import {FormControl, FormHelperText, Input} from '@material-ui/core';
import {mapTextProps, MappedQuestionProps} from '../question-wrappers';

interface Props extends MappedQuestionProps {
  readonly multiline?: boolean,
  readonly rows?: number,
  readonly rowsMax?: number,
}

interface State {
  touched: boolean;
}

class QuestionText extends React.Component<Props, State> {

  state: State = {
    touched: false,
  };

  render() {
    const {value, question, messages, multiline, rows, rowsMax, readonly} = this.props;
    return (
      <FormControl error={this.showError()} fullWidth>
        <Input value={value}
               multiline={multiline}
               rows={rows}
               rowsMax={rowsMax}
               disabled={readonly}
               onChange={e => this.handleChange(e.target.value)}
               onBlur={() => this.setState({touched: true})}
               />
        <FormHelperText title={'pattern: ' + question.pattern}>
          {this.showError() ? messages.invalidText : ''}
        </FormHelperText>
      </FormControl>
    );
  }

  private handleChange = value => {
    this.props.onChange(value);
  };

  private showError() {
    const {value, isValid, readonly, question} = this.props;
    if (isValid) return false;
    if (readonly) return true;
    if (!value || value === '') {
      if (!this.state.touched) return false;
      return question.required;
    }
    return true;
  }
}

export default mapTextProps(QuestionText);
