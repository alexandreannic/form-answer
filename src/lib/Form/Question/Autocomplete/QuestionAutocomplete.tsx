import "./QuestionAutocomplete.scss";

import * as React from "react";
import {MenuItem} from "material-ui/Menu";
import {Checkbox, FormControl, Icon, Input, InputAdornment, Menu, Radio} from "material-ui";
import {QuestionProps, questionWrapper} from "../questionWrapper";

interface Props extends QuestionProps {
    multiSelect: boolean;
}

interface State {
    anchorEl: any;
    filter: string;
}

class QuestionAutocomplete extends React.Component<Props, State> {

    state: State = {
        anchorEl: null,
        filter: null
    };

    render() {
        const {value, question, multiSelect, messages, readonly} = this.props;
        const {anchorEl} = this.state;
        return (
            <div>
                <FormControl onClick={this.open} fullWidth>
                    <Input value={multiSelect ? value.join(', ') : value} disabled={readonly}
                           multiline rows="1" rowsMax="10" readOnly
                           endAdornment={
                               <InputAdornment position="end">
                                   <Icon className="Qac_adornment">arrow_drop_down</Icon>
                               </InputAdornment>
                           }
                    />
                </FormControl>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.close}>
                    <header className={'Qac_Menu_head' + (multiSelect ? ' -withCb' : '')}>
                        {multiSelect &&
                        <Checkbox
                            onChange={this.selectAll}
                            indeterminate={value.length > 0 && value.length < question.possibilities.length}
                            disabled={readonly}/>
                        }
                        <input className="Qac_Menu_input" placeholder={messages.search}
                               onChange={e => this.setState({filter: e.target.value})}/>
                    </header>
                    <div className="Qac_Menu_items">
                        {this.getFilteredPossibilities().map(p =>
                            <MenuItem key={p.id} onClick={() => this.handleChange(p.label)} style={{paddingLeft: 0}}
                                      disabled={readonly}>
                                {multiSelect && <Checkbox disabled={readonly} checked={value.indexOf(p.label) !== -1}/>}
                                {!multiSelect && <Radio disabled={readonly} checked={value.indexOf(p.label) !== -1}/>}
                                {p.label}
                            </MenuItem>
                        )}
                    </div>
                </Menu>
            </div>
        );
    }

    private open = (event: any) => {
        this.setState({anchorEl: event.currentTarget});
    };

    private close = () => {
        this.setState({anchorEl: null});
    };

    private handleChange = (value: string[] | string) => {
        let newValue;
        if (this.props.multiSelect) {
            if (this.props.value.indexOf(value) === -1) newValue = this.props.value.concat(value);
            else newValue = this.props.value.filter(v => v !== value);
        } else {
            this.close();
            if (this.props.value.indexOf(value) === -1) newValue = value;
            else newValue = '';
        }
        this.props.onChange(newValue);
    };

    private getFilteredPossibilities() {
        const {filter} = this.state;
        if (filter && filter !== '')
            return this.props.question.possibilities.filter(q =>
                q.label.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1
            );
        return this.props.question.possibilities;
    }

    private selectAll = (event: any, checked: boolean) => {
        const values: string[] = checked ? this.props.question.possibilities.map(p => p.label) : [];
        this.props.onChange(values);
    };
}

export default questionWrapper(QuestionAutocomplete);