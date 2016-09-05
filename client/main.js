import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import React, {Component} from 'react';
import {render} from 'react-dom';
import FormBuilder from 'form-builder';

import customized_widgets from 'form-custom-components';
import preset from './preset.js';
import FormFactory from 'form-components/dist-component/client';

import '../node_modules/react-ui-tree/dist/react-ui-tree.css';
import '../node_modules/react-datetime/css/react-datetime.css';

import { Mongo } from "meteor/mongo";

const Forms = new Mongo.Collection('Forms');

import extensions from "form-builder/lib/form_engine_extensions";
import _Form from 'react-jsonschema-form';
const Form = extensions.conditional_logic(extensions.inline_validation(_Form));
//const Form = _Form;



import './main.html';

let custom = {
    fields: {
        paymentStatus: FormFactory.createBuilder('cb-payment-status')
    },
    widgets: {
        dateTime: FormFactory.createBuilder('cb-datetime'),
        label: FormFactory.createBuilder('cb-label'),
        wysiwyg: FormFactory.createBuilder('cb-wysiwyg', {
            onChange: (value) => console.log(value)
        })
    }
}



class App extends Component {
  constructor(props) {
    super(props);

      const forms = Forms.find({}).fetch();
      this.state={};
  }
  onSubmit(form){
      this.setState({formData:form.formData,editing:undefined});
  }
  listForms(){
      const forms = Forms.find({}).fetch();
    return (<ul className="list-group col-xs-12">
      {forms.map((form)=>(
              <li className="list-group-item" key={form.name}><span className="col-xs-3">{form.name}</span>

              <button className="btn btn-primary btn-xs" onClick={this.onOpen.bind(this,form)}>Open</button>

              </li>
      ))}
      </ul>);
  }
  onOpen(form){
    console.log(form.name);
    this.setState({editing:form});
  }
  render(){

    if(this.state.editing){
        const schema = this.state.editing;
        console.log(schema);
      return this.buildForm(this.state.editing.name,this.state.editing);
    }else{
        return (<div className="container">
                {this.listForms()}
                {this.state.formData?<textarea className="col-xs-12" value = {JSON.stringify(this.state.formData)}/>:null}
                </div>);
    }
  }
    buildForm(formName,formSchema){

    return (<div className="container"><Form
      widgets={custom.widgets}
      fields={custom.fields}
      onSubmit={this.onSubmit.bind(this)}
            schema={this.state.editing.schema}
            uiSchema={this.state.editing.uiSchema}
      /></div>);
  }
}

Meteor.startup(() => {
Meteor.subscribe('Forms', function(){
  console.log('fuuucccc');
  render(<App />, document.getElementById('app'));
});
});
