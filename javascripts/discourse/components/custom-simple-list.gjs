import Component from "@ember/component";
import { fn } from "@ember/helper";
import { on as on0 } from "@ember/modifier";
import { action } from "@ember/object";
import { empty } from "@ember/object/computed";
import { classNameBindings } from "@ember-decorators/component";
import DButton from "discourse/components/d-button";
import withEventValue from "discourse/helpers/with-event-value";
import { on } from "discourse/lib/decorators";
import { i18n } from "discourse-i18n";
import VideoUploader from "./video-uploader";
import VttUploader from "./vtt-uploader";

@classNameBindings(":value-list")
export default class CustomSimpleList extends Component {
  @empty("newValue") inputInvalid;

  inputDelimiter = null;
  newValue = "";
  collection = null;
  values = null;

  get resolvedPlaceholderKey() {
    return this.placeholderKey || themePrefix("simple_list_placeholder");
  }

  @on("didReceiveAttrs")
  _setupCollection() {
    const values = this.values;
    this.set(
      "collection",
      this._splitValues(values, this.inputDelimiter || "\n")
    );
  }

  keyUp(e) {
    if (e.keyCode === 13) {
      this.send("addValue", this.newValue);
    }
  }

  @action
  changeValue(index, event) {
    const newValue = event.target.value;
    this._replaceValue(index, newValue);
  }

  @action
  addValue(newValue) {
    if (this.inputInvalid) {
      return;
    }

    this.set("newValue", null);
    this._addValue(newValue);
  }

  @action
  removeValue(value) {
    this._removeValue(value);
  }

  @action
  addUploadUrl(value) {
    this.set("newValue", null);
    this._addValue(value);
  }

  _addValue(value) {
    this.collection.addObject(value);
    this._saveValues();
  }

  _removeValue(value) {
    this.collection.removeObject(value);
    this._saveValues();
  }

  _replaceValue(index, newValue) {
    this.collection.replace(index, 1, [newValue]);
    this._saveValues();
  }

  _saveValues() {
    this.set("values", this.collection.join(this.inputDelimiter || "\n"));
  }

  _splitValues(values, delimiter) {
    if (values && values.length) {
      return values.split(delimiter).filter((x) => x);
    } else {
      return [];
    }
  }

  <template>
    {{#if this.collection}}
      <div class="values">
        {{#each this.collection as |value index|}}
          <div class="value" data-index={{index}}>
            <DButton
              @action={{action "removeValue"}}
              @actionParam={{value}}
              @icon="xmark"
              class="remove-value-btn btn-small"
            />

            <input
              type="text"
              title={{value}}
              value={{value}}
              class="value-input"
              {{on0 "focusout" (fn this.changeValue index)}}
            />
          </div>
        {{/each}}
      </div>
    {{/if}}

    <div class="simple-list-input">
      <input
        type="text"
        value={{this.newValue}}
        placeholder={{i18n this.resolvedPlaceholderKey}}
        class="add-value-input"
        autocomplete="discourse"
        autocorrect="off"
        autocapitalize="off"
        {{on0 "input" (withEventValue (fn (mut this.newValue)))}}
      />

      {{#if this.newValue}}
        <DButton
          @action={{action "addValue"}}
          @actionParam={{this.newValue}}
          @icon="plus"
          class="add-value-btn btn-small"
        />
      {{else}}
        {{#if this.hasVideoUploader}}
          <VideoUploader @refresh={{action "addUploadUrl"}} />
        {{/if}}

        {{#if this.hasVTTUploader}}
          <VttUploader @refresh={{action "addUploadUrl"}} />
        {{/if}}
      {{/if}}
    </div>
  </template>
}
