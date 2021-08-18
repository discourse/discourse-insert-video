import { action } from "@ember/object";
import { empty, reads } from "@ember/object/computed";
import Component from "@ember/component";
import { on } from "discourse-common/utils/decorators";

export default Component.extend({
  classNameBindings: [":value-list"],
  inputInvalid: empty("newValue"),
  inputDelimiter: null,
  newValue: "",
  collection: null,
  values: null,
  placeholderKey: empty("placeholderKey")
    ? themePrefix("simple_list_placeholder")
    : reads("placeholderKey"),

  @on("didReceiveAttrs")
  _setupCollection() {
    const values = this.values;
    this.set(
      "collection",
      this._splitValues(values, this.inputDelimiter || "\n")
    );
  },

  keyUp(e) {
    if (e.keyCode === 13) {
      this.send("addValue", this.newValue);
    }
  },

  @action
  changeValue(index, newValue) {
    this._replaceValue(index, newValue);
  },

  @action
  addValue(newValue) {
    if (this.inputInvalid) {
      return;
    }

    this.set("newValue", null);
    this._addValue(newValue);
  },

  @action
  removeValue(value) {
    this._removeValue(value);
  },

  @action
  addUploadUrl(value) {
    this.set("newValue", null);
    this._addValue(value);
  },

  _addValue(value) {
    this.collection.addObject(value);
    this._saveValues();
  },

  _removeValue(value) {
    this.collection.removeObject(value);
    this._saveValues();
  },

  _replaceValue(index, newValue) {
    this.collection.replace(index, 1, [newValue]);
    this._saveValues();
  },

  _saveValues() {
    this.set("values", this.collection.join(this.inputDelimiter || "\n"));
  },

  _splitValues(values, delimiter) {
    if (values && values.length) {
      return values.split(delimiter).filter((x) => x);
    } else {
      return [];
    }
  },
});
