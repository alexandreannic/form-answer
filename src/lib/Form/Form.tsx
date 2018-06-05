import * as React from 'react';
import {ExpensionStep, ExpensionStepper} from '../ExpensionStepper';
import {Section} from './Section';
import {connect} from 'react-redux';
import {formAction} from './form.action';
import {ApiParser} from '../utils/ApiParser';
import {Id} from '../types/Id';
import {IAnswer} from '../types/Answer';
import {QuestionId, QuestionType} from '../types/Question';
import {SectionId} from '../types/Section';
import {IDoc} from '../types/Doc';
import {IForm} from '../types/Form';
import {defaultMessages, IMessages} from '../types/Messages';
import {MuiThemeProvider} from 'material-ui';
import createMuiTheme from 'material-ui/styles/createMuiTheme';

export interface FormProps {
  readonly?: boolean;
  form: IForm;
  dateFormat?: string;
  muiTheme?: any;
  messages?: IMessages;
  maxUploadFileSize?: number;
  dispatch: any;
  answers: any;
  onChange?: (a: IAnswer) => void;
  onSectionEnd?: (a: IAnswer[]) => void;
  onEnd?: (a: IAnswer[]) => void;
  onUploadFile?: (file: File, callback: (d: IDoc) => void) => void;
}

class Form extends React.Component<FormProps, any> {

  public static defaultProps: Partial<FormProps> = {
    messages: defaultMessages
  };

  private parser: ApiParser;

  render() {
    const {muiTheme} = this.props;
    if (muiTheme)
      return (
        <MuiThemeProvider theme={createMuiTheme(muiTheme)}>
          {this.renderForm()}
        </MuiThemeProvider>
      );
    return this.renderForm();
  }

  renderForm() {
    return (
      <ExpensionStepper free={this.props.readonly} onNext={this.next} onEnd={this.end}>
        {this.props.form.sections.map(s =>
          <ExpensionStep label={s.name} component={<Section section={s}/>} key={s.id}/>
        )}
      </ExpensionStepper>
    );
  }

  componentWillMount() {
    this.parser = new ApiParser(this.props.dateFormat);
    this.initReducerParams();
    this.initReducerAnswers();
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.form != prevProps.form) this.initReducerAnswers();
  }

  private initReducerParams() {
    const {
      dispatch,
      dateFormat,
      messages,
      maxUploadFileSize,
      readonly,
    } = this.props;
    dispatch(formAction.init({
      dateFormat: dateFormat,
      messages: messages,
      maxUploadFileSize: maxUploadFileSize,
      triggerOnChange: this.onChange,
      onUploadFile: this.onUploadFile,
      readonly: readonly || false,
    }));
  }

  private initReducerAnswers() {
    this.props.form.sections.forEach(s => s.questions.forEach(q => {
      if (q.question_type === QuestionType.LABEL) return;
      this.props.dispatch(formAction.updateAnswer(
        q.id,
        q.question_type,
        this.parser.fromApi(q.question_type)(q.answers)
      ))
    }));
  }

  private onUploadFile = (sectionId: SectionId, questionId: QuestionId, file: File) => {
    const {dispatch, onUploadFile} = this.props;
    onUploadFile(file, this.onFileUploaded(sectionId, questionId));
    dispatch(formAction.documentUploading(questionId, true));
  };

  private onFileUploaded = (sectionId: SectionId, questionId: QuestionId) => (uploadedFile: IDoc) => {
    const {dispatch} = this.props;
    dispatch(formAction.documentUploading(questionId, false));
    dispatch(formAction.updateAnswer(questionId, QuestionType.DOCUMENT, [uploadedFile.name, uploadedFile.permalink]));
    dispatch(formAction.updateSectionValidity(sectionId, questionId, true));
    this.onChange(questionId);
  };

  private onChange = (questionIdAnswered: QuestionId) => {
    if (!this.props.onChange) return;
    setTimeout(() =>
      this.props.onChange(this.parseAnswer(questionIdAnswered, this.props.answers[questionIdAnswered]))
    );
  };

  private next = (sectionIndex: number) => {
    if (!this.props.onSectionEnd) return;
    this.props.onSectionEnd(this.parseAnswers(this.getSectionAnswers(sectionIndex)));
  };

  private end = () => {
    const {form, answers, onSectionEnd, onEnd} = this.props;
    if (onSectionEnd)
      onSectionEnd(this.parseAnswers(this.getSectionAnswers(form.sections.length - 1)));
    if (onEnd)
      onEnd(this.parseAnswers(answers));
  };

  private getSectionAnswers(sectionIndex: number): { [key: string]: IAnswer[] } {
    const {answers} = this.props;
    const sectionQuestionIds = this.props.form.sections[sectionIndex].questions.map(q => q.id);
    return Object.keys(answers).filter(key => sectionQuestionIds.includes(key)).reduce((obj, key) => {
      obj[key] = answers[key];
      return obj;
    }, {});
  }

  private parseAnswers = (answers: { [key: string]: IAnswer[] }): IAnswer[] => {
    return Object.keys(answers).map((k: Id) => this.parseAnswer(k, answers[k])).filter((v: any) => v);
  };

  private parseAnswer = (id: Id, answer: any): IAnswer | null => {
    const value = this.parser.toApi(answer.type)(answer.value);
    if (value)
      return {question_id: id, answer: value}
  };
}

const state2Props = (state: any) => ({
  answers: state.formAnswer.answers,
});

export default connect(state2Props)(Form);
