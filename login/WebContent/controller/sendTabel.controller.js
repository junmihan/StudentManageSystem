sap.ui.define([
	"sap/m/MessageToast",
	'jquery.sap.global',
	"sap/m/MessageBox",
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
	], function(MessageToast,jQuery,MessageBox,Controller,JSONModel) {
	'use strict';
	return Controller.extend('sap.ui.demo.walkthrough.controller.sendTabel', {
		getData: function(target){
			var result={
					questions:[
						],
						temp: {
						}
			};
			this.getView().setModel(new sap.ui.model.json.JSONModel(result));
			this.getView().getModel().getData().receive=target;
			this.getView().getModel().refresh();
		},
		onAddQuestion: function(oEvent){
			if(this._oDialog)this._oDialog.destroy();
			this._oDialog = sap.ui.xmlfragment("sap.ui.demo.walkthrough.view.addQuestionDialog", this);
			var temp={
					Name: "",
					Type: "单选",
					Require: false,
					Choices: [],
					flag: false
			}
			this._oDialog.setModel(new sap.ui.model.json.JSONModel(temp));
			var data=this._oDialog.getModel().getData();
			if(temp.Type=="单选")data.singalChoice=true;
			else data.singalChoice=false;
			if(temp.Type=="多选")data.multiChoice=true;
			else data.multiChoice=false;
			if(temp.Type=="填空")data.freeAnswer=true;
			else data.freeAnswer=false;
			if(temp.Type=="填空")data.isChoices=false;
			else data.isChoices=true;
			this._oDialog.getModel().refresh();
			this._oDialog.open();
		},
		onChangeQuestion: function(oEvent){
			var a=1;
			if(this._oDialog)this._oDialog.destroy();
			this._oDialog = sap.ui.xmlfragment("sap.ui.demo.walkthrough.view.addQuestionDialog", this);
			var pos=parseInt(oEvent.getSource().getBindingContext().getPath().split('/')[2]);
			var temp=this.getView().getModel().getData().questions[pos];
			this._oDialog.setModel(new sap.ui.model.json.JSONModel(temp));
			var data=this._oDialog.getModel().getData();
			if(temp.Type=="单选")data.singalChoice=true;
			else data.singalChoice=false;
			if(temp.Type=="多选")data.multiChoice=true;
			else data.multiChoice=false;
			if(temp.Type=="填空")data.freeAnswer=true;
			else data.freeAnswer=false;
			if(temp.Type=="填空")data.isChoices=false;
			else data.isChoices=true;
			data.flag=true;
			data.pos=pos;
			this._oDialog.getModel().refresh();
			this._oDialog.open();
		},
		onDeleteQuestion: function(oEvent){
			var questions=this.getView().getModel().getData().questions;
			var pos=parseInt(oEvent.getParameter("listItem").getBindingContext().getPath().split('/')[2]);
			for(var i=pos;i<(questions.length)-1;i++)questions[i]=questions[i+1];
			questions.pop();
			this.getView().getModel().refresh();
			if(this.getView().getModel().getData().questions.length==0){
				this.getView().byId("questionList").setVisible(false);
				this.getView().byId("questionDetailList").setVisible(false);
			}
		},
		onAddQuestionDialogOk: function(oEvent){
			var temp=this._oDialog.getModel().getData();
			if(temp.Name.length==0||(temp.Choices.length==0&&this._oDialog.getContent()[0].getItems()[3].getItems()[2].getSelected()==false)){
				MessageToast.show("请完成问卷");
			}
			else {
				if(this._oDialog.getContent()[0].getItems()[3].getItems()[0].getSelected()==true){
					temp.Type="单选";
					temp.singalChoice=true;
					temp.multiChoice=false;
					temp.freeAnswer=false;
				}
				else if(this._oDialog.getContent()[0].getItems()[3].getItems()[1].getSelected()==true){
					temp.Type="多选";
					temp.singalChoice=false;
					temp.multiChoice=true;
					temp.freeAnswer=false;
				}
				else {
					temp.Type="填空";
					temp.singalChoice=false;
					temp.multiChoice=false;
					temp.freeAnswer=true;
				}
				if(temp.flag==false){
					this.getView().getModel().getData().questions.push(temp);
					this._oDialog.close();
					this.getView().getModel().refresh();
				}
				else {
					this.getView().getModel().getData().questions[temp.pos]=temp;
					this._oDialog.close();
					this.getView().getModel().refresh();
				}
			}
			this.getView().byId("questionList").setVisible(true);
			this.getView().byId("questionDetailList").setVisible(true);
		},
		onAddQuestionDialogEnd: function(oEvent){
			this._oDialog.close();
		},
		selectFreeAnswer: function(){
			var flag=!(this._oDialog.getModel().getData().isChoices);
			this._oDialog.getModel().getData().isChoices=flag;
			this._oDialog.getModel().refresh();
		},
		onAddChoose: function(){
			var a=1;
			var choice=this._oDialog.getContent()[0].getItems()[7].getItems()[0].getValue();
			if(choice.length==0)MessageToast.show("请输入要添加的选项");
			else {
				this._oDialog.getModel().getData().Choices.push(choice);
				this._oDialog.getContent()[0].getItems()[7].getItems()[0].setValue("");
				this._oDialog.getModel().refresh()
			}
		},
		onChoiceDelete: function(oEvent){
			var choices=this._oDialog.getModel().getData().Choices;
			var pos=parseInt(oEvent.getParameter("listItem").getBindingContext().getPath().split('/')[2]);
			for(var i=pos;i<(choices.length)-1;i++)choices[i]=choices[i+1];
			choices.pop();
			this._oDialog.getModel().refresh()
		}
	});	
});