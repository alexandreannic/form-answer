import React, {Component} from "react";
import {FormControlLabel, Radio, RadioGroup} from "material-ui";
import {mapSingleAnswer, parseSingleAnswer} from "../../utils";
import {questionWrapper} from "../questionWrapper";
import {maxPossibilitiesBeforeAutocomplete} from "../Question";
import QuestionAutocomplete from "../Autocomplete/QuestionAutocomplete";

class QuestionRadio extends Component {

    render() {
        const {question, values} = this.props;
        if (question.possibilities.length < maxPossibilitiesBeforeAutocomplete)
            return (
                <RadioGroup
                    value={values}
                    onChange={e => this.handleChange(e.target.value)}
                >
                    {question.possibilities.map(p =>
                        <FormControlLabel
                            value={p.label}
                            control={<Radio/>}
                            label={p.label}
                            key={p.id}
                            onClick={() => values === p.label && this.handleChange('')}/>
                    )}
                </RadioGroup>
            );
        return <QuestionAutocomplete {...this.props}/>
    }

    handleChange = value => {
        this.props.onChange(parseSingleAnswer(value));
        const possibility = this.props.question.possibilities.find(p => p.label === value);
        if (possibility) this.props.onCheckPossibility(possibility.id);
    };
}

const mapProps = Component => props => {
    const {values, ...other} = props;
    return <Component values={mapSingleAnswer(values)} {...other}/>
}
export default questionWrapper(mapProps(QuestionRadio));