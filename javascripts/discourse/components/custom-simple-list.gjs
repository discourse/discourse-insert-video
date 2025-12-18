import Component from "@ember/component";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { empty } from "@ember/object/computed";
import { classNameBindings } from "@ember-decorators/component";
import DButton from "discourse/components/d-button";
import withEventValue from "discourse/helpers/with-event-value";
import {
  addUniqueValueToArray,
  removeValueFromArray,
} from "discourse/lib/array-tools";
import { trackedArray } from "discourse/lib/tracked-tools";
import { i18n } from "discourse-i18n";
import VideoUploader from "./video-uploader";
import VttUploader from "./vtt-uploader";

@classNameBindings(":value-list")
export default class CustomSimpleList extends Component {
  @empty("newValue") inputInvalid;

  inputDelimiter = null;
  newValue = "";
  @trackedArray collection = null;
  values = null;

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    this.set(
      "collection",
      this._splitValues(this.values, this.inputDelimiter || "\n")
    );
  }

  get resolvedPlaceholderKey() {
    return this.placeholderKey || themePrefix("simple_list_placeholder");
  }

  keyUp(e) {
    if (e.keyCode === 13) {
      this.addValue(this.newValue);
    }
  }

  @action
  changeValue(index, event) {
    const newValue = event.target.value;
    this.collection.replace(index, 1, [newValue]);
    this._saveValues();
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
    removeValueFromArray(this.collection, value);
    this._saveValues();
  }

  @action
  addUploadUrl(value) {
    this.set("newValue", null);
    this._addValue(value);
  }

  _addValue(value) {
    addUniqueValueToArray(this.collection, value);
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
              @action={{fn this.removeValue value}}
              @icon="xmark"
              class="remove-value-btn btn-small"
            />

            <input
              {{on "focusout" (fn this.changeValue index)}}
              type="text"
              title={{value}}
              value={{value}}
              class="value-input"
            />
          </div>
        {{/each}}
      </div>
    {{/if}}

    <div class="simple-list-input">
      <input
        {{on "input" (withEventValue (fn (mut this.newValue)))}}
        type="text"
        value={{this.newValue}}
        placeholder={{i18n this.resolvedPlaceholderKey}}
        autocomplete="discourse"
        autocorrect="off"
        autocapitalize="off"
        class="add-value-input"
      />

      {{#if this.newValue}}
        <DButton
          @action={{fn this.addValue this.newValue}}
          @icon="plus"
          class="add-value-btn btn-small"
        />
      {{else}}
        {{#if this.hasVideoUploader}}
          <VideoUploader @refresh={{this.addUploadUrl}} />
        {{/if}}

        {{#if this.hasVTTUploader}}
          <VttUploader @refresh={{this.addUploadUrl}} />
        {{/if}}
      {{/if}}
    </div>
  </template>
}
