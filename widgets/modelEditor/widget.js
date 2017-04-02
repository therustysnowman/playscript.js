
module.exports = {
  create: create
};

var Util = require("../../lib/util");
var createTrigger = require("../../lib/trigger").create;

require("./style.scss");

/** FieldEditor ***************************************************************/

function FieldEditor(className, template, opts) {

  this._name = opts.name;
  this._model = opts.model;
  this._group = opts.group;

  this._wrapper = document.createElement("div");
  this._wrapper.classList.add(className);
  this._wrapper.innerHTML = template;

  this._wrapper.querySelector(".js-label").textContent =
    Util.isUndefined(opts.model.label) ? opts.name: opts.model.label;

  this._trigger = createTrigger("fieldEditor");
  this._trigger.addInterface(this);

  var that = this;
  var delButton = this._wrapper.querySelector(".js-delField");
  if (delButton !== null) {
    if (opts.custom === true) {
      delButton.addEventListener("click", function() {
        that._trigger.trigger("delete", that);
        that._wrapper.parentNode.removeChild(that._wrapper);
      });
    } else {
      delButton.parentNode.removeChild(delButton);
    }
  }
}

FieldEditor.prototype.getElement = function() {
  return this._wrapper;
}

FieldEditor.prototype.getGroup = function() {
  return this._group;
}

FieldEditor.prototype.getName = function() {
  return this._name;
}

FieldEditor.prototype._changed = function() {
  this._trigger.trigger("change", this);
}

FieldEditor.prototype.appendTo = function(container) {
  container.appendChild(this._wrapper);
}

FieldEditor.prototype.setData = function(data) {
  if (!Util.isUndefined(data[this._name])) {
    this.setValue(data[this._name]);
  }
}

FieldEditor.prototype.getData = function(data) {
  if (this.isSet()) {
    data[this._name] = this.getValue();
  }
}

FieldEditor.prototype.getModel = function(modelContainer) {
  modelContainer[this._name] = this._model;
}

FieldEditor.prototype.isSet = function() {
  return true;
}

FieldEditor.prototype.setValue = function(value) {}

FieldEditor.prototype.getValue = function() {}

/** InputEditor ***************************************************************/

function InputEditor(opts) {

  FieldEditor.call(this, "ps-inputEditor", require('./inputEditor.html'), opts);

  this._input = this._wrapper.querySelector("input");
  this._input.type = "text";

  this.setData(opts.data);

  var that = this;
  this._input.addEventListener("change", function() {
    that._changed();
  });
}
InputEditor.prototype = Object.create(FieldEditor.prototype);
InputEditor.prototype.constructor = InputEditor;

InputEditor.prototype.isSet = function() {
  var val = this.getValue();
  return !Util.isUndefined(val) && val !== "";
}

InputEditor.prototype.setValue = function(value) {
  this._input.value = value;
}

InputEditor.prototype.getValue = function() {
  return this._input.value;
}

/** StringEditor **************************************************************/

function StringEditor(opts) {
  InputEditor.call(this, opts);
  this._input.placeholder = "string";
}
StringEditor.prototype = Object.create(InputEditor.prototype);
StringEditor.prototype.constructor = StringEditor;

/** IntegerEditor *************************************************************/

function IntegerEditor(opts) {
  InputEditor.call(this, opts);
  this._input.placeholder = "integer";
}
IntegerEditor.prototype = Object.create(InputEditor.prototype);
IntegerEditor.prototype.constructor = IntegerEditor;

/** IntegerEditor *************************************************************/

function DoubleEditor(opts) {
  InputEditor.call(this, opts);
  this._input.placeholder = "double";
}
DoubleEditor.prototype = Object.create(InputEditor.prototype);
DoubleEditor.prototype.constructor = DoubleEditor;

/** StringListEditor **********************************************************/

function StringListEditor(opts) {

  FieldEditor.call(this, "ps-listEditor", require("./listEditor.html"), opts);

  this._list = this._wrapper.querySelector(".js-list");

  this.setData(opts.data);

  var that = this;
  this._wrapper.querySelector(".js-add").addEventListener("click", function() {
    that.addListItem();
  });
}
StringListEditor.prototype = Object.create(StringEditor.prototype);
StringListEditor.prototype.constructor = StringListEditor;

StringListEditor.prototype.addListItem = function(value) {

  var that = this;

  value = Util.defaultVal(value, "");

  var newItem = document.createElement("div");
  newItem.classList.add("ps-modelEditor-fieldListItem");
  newItem.innerHTML = require("./listEditorItem.html");
  this._list.appendChild(newItem);

  var input = newItem.querySelector("input");
  input.value = value;
  input.addEventListener("change", function() {
    that._changed();
  });

  newItem.querySelector("button").addEventListener("click", function() {
    that._list.removeChild(newItem);
    that._changed();
  });
}

StringListEditor.prototype.clearListItems = function(value) {
  this._list.innerHTML = "";
}

StringListEditor.prototype.setValue = function(value) {
  this.clearListItems();

  var that = this;
  value.forEach(function(val) {
    that.addListItem(val);
  });
}

StringListEditor.prototype.getValue = function() {
  var list = [];
  this._list.querySelectorAll("input").forEach(function(input) {
    if (input.value !== "") {
      list.push(input.value);
    }
  });
  return list;
}

/** SelectEditor **************************************************************/

function SelectEditor(opts, choices) {

  FieldEditor.call(this, "ps-selectEditor", require("./selectEditor.html"), opts);

  this._select = this._wrapper.querySelector("select");

  var that = this;

  (choices || opts.model.choices || []).forEach(function(choice) {
    if (choice.value === "") {
      that._select.querySelector("option[value='']").textContent = choice.label;
    } else {
      var option = document.createElement("option");
      option.textContent = choice.label;
      option.value = choice.value;
      that._select.appendChild(option);
    }
  });

  this.setData(opts.data);

  this._select.addEventListener("change", function() {
    that._changed();
  });
}
SelectEditor.prototype = Object.create(FieldEditor.prototype);
SelectEditor.prototype.constructor = SelectEditor;

SelectEditor.prototype.isSet = function() {
  var val = this.getValue();
  return !Util.isUndefined(val) && val !== "";
}

SelectEditor.prototype.setValue = function(value) {
  this._select.value = this.toOptionValue(value);
}

SelectEditor.prototype.getValue = function() {
  return this.fromOptionValue(this._select.value);
}

SelectEditor.prototype.toOptionValue = function(value) {
  return value;
}

SelectEditor.prototype.fromOptionValue = function(value) {
  return value;
}

/** ChoiceEditor **************************************************************/

function ChoiceEditor(opts) {
  SelectEditor.call(this, opts);
}
ChoiceEditor.prototype = Object.create(SelectEditor.prototype);
ChoiceEditor.prototype.constructor = ChoiceEditor;

/** ChoiceEditor **************************************************************/

function BooleanEditor(opts) {
  SelectEditor.call(this, opts, [
    { label: "Yes", value: "Y" },
    { label: "No", value: "N" },
  ]);
}
BooleanEditor.prototype = Object.create(SelectEditor.prototype);
BooleanEditor.prototype.constructor = BooleanEditor;

BooleanEditor.prototype.fromOptionValue = function(value) {
  if (value === "Y") {
    return true;
  } else if (value === "N" ) {
    return false;
  }
}

BooleanEditor.prototype.toOptionValue = function(value) {
  if (value === true) {
    return "Y";
  } else if (value === false) {
    return "N";
  } else {
    return "";
  }
}

/** VectorEditor **************************************************************/

function VectorEditor(opts) {

  FieldEditor.call(this, "ps-vectorEditor", require("./vectorEditor.html"), opts);

  if (!Util.isUndefined(opts.model.xLabel)) {
    this._wrapper.querySelector(".js-x-label").textContent = model.xLabel;
  }
  if (!Util.isUndefined(opts.model.yLabel)) {
    this._wrapper.querySelector(".js-y-label").textContent = model.yLabel;
  }

  this._xInput = this._wrapper.querySelector(".js-x-val");
  this._yInput = this._wrapper.querySelector(".js-y-val");

  this.setData(opts.data);

  var that = this;
  this._xInput.addEventListener("change", function() {
    that._changed();
  });
  this._yInput.addEventListener("change", function() {
    that._changed();
  });
}
VectorEditor.prototype = Object.create(FieldEditor.prototype);
VectorEditor.prototype.constructor = VectorEditor;

VectorEditor.prototype.setValue = function(value) {
  var that = this;
  this._xInput = Util.defaultVal(value.x, "");
  this._yInput = Util.defaultVal(value.y, "");
}

VectorEditor.prototype.getValue = function() {
  return { x: this._xInput.value, y: this._yInput.value };
}

/** FunctionEditor ************************************************************/

var createDialog = require('../dialog/widget').create;
var createFunctionEditor = require('../functionEditor/widget').create;

function FunctionEditor(opts) {

  FieldEditor.call(this, "ps-buttonEditor", require('./buttonEditor.html'), opts);

  this._button = this._wrapper.querySelector("button");
  this.setValue();

  this.setData(opts.data);

  var that = this;

  this._button.addEventListener("click", function() {

    var container = document.createElement("div");
    var funcEditor = createFunctionEditor(that.isSet() ? that.getValue() : "");
    funcEditor.appendTo(container);

    var dialogHandle = createDialog(
      name + " function editor",
      container,
      [
        {
          label: "OK",
          callback: function() {
            that.setValue(funcEditor.get());
            that._changed();
            dialogHandle.close();
          }
        },
        {
          label: "Cancel",
          callback: function() {
            dialogHandle.close();
          }
        }
      ]
    );
  });
}
FunctionEditor.prototype = Object.create(FieldEditor.prototype);
FunctionEditor.prototype.constructor = FunctionEditor;

FunctionEditor.prototype.isSet = function() {
  var val = this.getValue();
  return !Util.isUndefined(val) && val !== "";
}

FunctionEditor.prototype.setValue = function(value) {
  this._value = value;
  if (this.isSet()) {
    this._button.textContent = "Edit";
  } else {
    this._button.textContent = "Set";
  }
}

FunctionEditor.prototype.getValue = function() {
  return this._value;
}

/** Model editor **************************************************************/

function addSection(container, title) {

  var section = document.createElement("div");
  section.innerHTML = require("./section.html");
  section.classList.add("ps-section");
  section.querySelector(".js-sectionTitle").textContent = title;
  container.appendChild(section);

  return {
    destroy: function() {
      container.removeChild(section);
    },
    addControl: function(ele) {
      section.querySelector(".js-sectionControls").appendChild(ele);
    },
    addContent: function(ele) {
      section.querySelector(".js-sectionContent").appendChild(ele);
    }
  }
}

function createEditor(args, defaultType) {

  var editor = null;

  var type = Util.defaultVal(args.model.type, defaultType);

  switch (type) {
    case "string":
      editor = new StringEditor(args);
      break;
    case "stringlist":
      editor = new StringListEditor(args);
      break;
    case "integer":
      editor = new IntegerEditor(args);
      break;
    case "double":
      editor = new DoubleEditor(args);
      break;
    case "boolean":
      editor = new BooleanEditor(args);
      break;
    case "choice":
      editor = new ChoiceEditor(args);
      break;
    case "vector":
      editor = new VectorEditor(args);
      break;
    case "function":
      editor = new FunctionEditor(args);
      break;
  }

  return editor;
}

function create(container, model, data) {

  var _trigger = createTrigger("modelEditor");

  function triggerChange() {
    _trigger.trigger("change", _interface);
  }
  var _listener = {
    "fieldEditor-change": triggerChange,
    "fieldEditor-delete": function(field) {
      var index = objects[field.getGroup()].indexOf(field);
      if (index > -1) {
        objects[field.getGroup()].splice(index, 1);
        triggerChange();
      }
    }
  };

  data = Util.defaultVal(data, {});

  var heading;

  var objects = {
    properties: [],
    hooks: [],
    data: [],
    functions: []
  };

  if (!Util.isUndefined(model.properties)) {

    var section = addSection(container, "Properties");

    var propertiesModel = Util.defaultVal(model.properties, {});
    var propertiesData = Util.defaultVal(data.properties, {});
    Object.keys(Util.defaultVal(model.properties, {})).forEach(function(itmName) {
      var editor = createEditor({
        name: itmName,
        group: "properties",
        model: propertiesModel[itmName],
        data: propertiesData
      });
      if (editor !== null) {
        section.addContent(editor.getElement());
        editor.addListener(_listener);
        objects.properties.push(editor);
      }
    });
  }

  if (!Util.isUndefined(model.hooks)) {

    var section = addSection(container, "Hooks");

    var hooksModel = Util.defaultVal(model.hooks, {});
    var hooksData = Util.defaultVal(data.hooks, {});

    Object.keys(hooksModel).forEach(function(itmName) {
      var editor = createEditor({
        name: itmName,
        group: "hooks",
        model: hooksModel[itmName],
        data: hooksData
      }, "function");
      if (editor !== null) {
        section.addContent(editor.getElement());
        editor.addListener(_listener);
        objects.hooks.push(editor);
      }
    });
  }

  if (!Util.isUndefined(model.data))  {

    var custDataSection = addSection(container, "Data");

    function addCustDataEditor(args) {
      args.custom = true;
      args.group = "data";
      var editor = createEditor(args);
      if (editor !== null) {
        custDataSection.addContent(editor.getElement());
        editor.addListener(_listener);
        objects.data.push(editor);
      }
    }

    function addCustomDataDialog() {

      var dialogContent = document.createElement("div");
      dialogContent.innerHTML = require("./customDataDialog.html");

      var dialogHandle = createDialog(
        "Add custom data item",
        dialogContent,
        [
          {
            label: "Create",
            callback: function() {
              var name = dialogContent.querySelector("input").value;
              var type = dialogContent.querySelector("select").value;
              if (name !== "" &&  type !== "") {
                addCustDataEditor({
                  name: name,
                  model: {
                    type: type
                  },
                  data: hooksData
                });
                triggerChange();
                dialogHandle.close();
              }
            }
          },
          {
            label: "Cancel",
            callback: function() {
              dialogHandle.close();
            }
          }
        ]
      );
    }

    var addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.addEventListener("click", function() {
      addCustomDataDialog();
    });
    custDataSection.addControl(addButton);

    var added = ["_model"];

    if (!Util.isUndefined(data.data) && !Util.isUndefined(data.data._model)) {
      Object.keys(data.data._model).forEach(function(itmName) {
        added.push(itmName);
        addCustDataEditor({
          name: itmName,
          model: data.data._model[itmName],
          data: data.data
        });
      });
    }

    if (!Util.isUndefined(data.data)) {
      Object.keys(data.data).forEach(function(itmName) {
        if (added.indexOf(itmName) === -1) {
          addCustDataEditor({
            name: itmName,
            model: { type: "string" },
            data: data.data
          });
        }
      });
    }
  }

  if (!Util.isUndefined(model.functions))  {

    var custFuncSection = addSection(container, "Functions");

    var functionsModel = Util.defaultVal(model.functions, {});
    var functionsData = Util.defaultVal(data.functions, {});

    function addCustFuncEditor(args) {
        args.custom = true;
        args.group = "functions";
        var editor = createEditor(args, "function");
        if (editor !== null) {
          custFuncSection.addContent(editor.getElement());
          editor.addListener(_listener);
          objects.functions.push(editor);
        }
    }

    function addCustomFunctionDialog() {

      var dialogContent = document.createElement("div");
      dialogContent.innerHTML = require("./customFunctionDialog.html");

      var dialogHandle = createDialog(
        "Add custom function",
        dialogContent,
        [
          {
            label: "Create",
            callback: function() {
              var val = dialogContent.querySelector("input").value;
              if (val !== "") {
                addCustFuncEditor({
                  name: val,
                  model: {},
                  data: hooksData
                });
                dialogHandle.close();
              }
            }
          },
          {
            label: "Cancel",
            callback: function() {
              dialogHandle.close();
            }
          }
        ]
      );
    }

    var addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.addEventListener("click", function() {
      addCustomFunctionDialog();
    });
    custFuncSection.addControl(addButton);

    Object.keys(functionsData).forEach(function(itmName) {
      if (added.indexOf(itmName) === -1) {
        addCustFuncEditor({
          name: itmName,
          model: {},
          data: funcsData
        });
      }
    });
  }

  var _interface = {
    getData: function() {
      var data = {};
      ["properties", "hooks", "functions"].forEach(function(section) {
        if (objects[section].length > 0) {
          data[section] = {};
          var models = {};
          objects[section].forEach(function(obj) {
            obj.getData(data[section]);
          });
        }
      });
      if (objects.data.length > 0) {
        data.data = {};
        data.data._model = {};
        objects.data.forEach(function(obj) {
          obj.getData(data.data);
          obj.getModel(data.data._model);
        });
      }
      return data;
    }
  };

  _trigger.addInterface(_interface);

  return _interface;
}
