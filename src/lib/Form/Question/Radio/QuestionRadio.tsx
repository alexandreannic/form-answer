import * as React from 'react';
import {FormControlLabel, Radio, RadioGroup} from '@material-ui/core';
import {mapRadioProps, MappedQuestionProps} from '../question-wrappers';

interface Props extends MappedQuestionProps {
}

class QuestionRadio extends React.Component<Props, {}> {

  render() {
    const {question, value, readonly} = this.props;
    return (
      <RadioGroup
        value={value}
        onChange={(e: any) => this.handleChange(e.target.value)}
      >
        {question.possibilities.map(p =>
          <FormControlLabel
            value={p.label}
            control={<Radio/>}
            label={p.label}
            key={p.id}
            onClick={() => value === p.label && this.handleChange('')}
            disabled={readonly}/>
        )}
      </RadioGroup>
    );
  }

  private handleChange = (value: string) => {
    this.props.onChange(value);
  };
}

export default mapRadioProps(QuestionRadio);
