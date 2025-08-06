import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { empty } from "@ember/object/computed";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";
import DModal from "discourse/components/d-modal";
import { isVideo } from "discourse/lib/uploads";
import { i18n } from "discourse-i18n";
import CustomSimpleList from "../custom-simple-list";
import PosterUploader from "../poster-uploader";

export default class InsertVideoModal extends Component {
  @service appEvents;

  @tracked sources;
  @tracked tracks;
  @tracked poster;
  @empty("sources") insertDisabled;

  _keyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  @action
  async preventSubmitOnEnter(modal) {
    // prevent submitting on enter while adding items to lists using Enter
    modal
      .querySelector(".video-sources")
      .addEventListener("keydown", this._keyDown);

    modal
      .querySelector(".video-subtitles")
      .addEventListener("keydown", this._keyDown);
  }

  get trackList() {
    if (!this.tracks) {
      return [];
    }

    return this.tracks.split("|");
  }

  get sourceList() {
    if (!this.sources) {
      return [];
    }

    return this.sources.split("|");
  }

  get validationMessage() {
    const allVideos = this.sourceList.every(
      (url) => isVideo(url) || url.endsWith(".m3u8")
    );

    return allVideos ? "" : i18n(themePrefix("source_not_video"));
  }

  _sourceType(src) {
    let prefix, type;
    if (src.endsWith(".m3u8")) {
      prefix = "application";
      type = "x-mpegURL";
    } else {
      prefix = "video";
      type = src.substring(src.lastIndexOf(".") + 1);
    }
    return `${prefix}/${type}`;
  }

  @action
  insertVideo() {
    let sources = "";
    let tracks = "";

    this.sourceList.forEach((src) => {
      sources += `\n  <source src="${src}" type="${this._sourceType(src)}" />`;
    });

    const controlslist = settings?.disable_download
      ? `controlslist="nodownload" `
      : "";

    this.trackList.forEach((t, i) => {
      const track = t.split(",");
      const url = track[0];
      const label = track[1] || "English";
      const langcode = track[2] || "en";
      const def = i === 0 ? " default" : "";

      tracks += `\n  <track src="${url}" label="${label}" kind="subtitles" srclang="${langcode}"${def}/>`;
    });

    const poster = this.poster ? ` poster="${this.poster}"` : "";
    let text = `<video controls ${controlslist} preload="metadata"${poster}>${sources}${tracks}\n</video>`;

    if (settings?.disable_download) {
      //Added here since it only gets added when copy pasting the video into the composer
      text = `<div class="video-container">${text}</div>`;
    }

    this.args.model.toolbarEvent.addText(text);
    this.appEvents.trigger("discourse-insert-video:video-inserted", text);
    this.args.closeModal();
  }

  @action
  setPoster(val) {
    this.poster = val;
  }

  <template>
    <DModal
      @closeModal={{@closeModal}}
      @title={{i18n (themePrefix "modal.title")}}
      class="insert-video-modal"
      {{didInsert this.preventSubmitOnEnter}}
    >
      <:body>
        <div class="insert-video-inputs video-sources">
          <label>
            {{i18n (themePrefix "modal.video_title")}}
          </label>

          <CustomSimpleList
            @values={{this.sources}}
            @hasVideoUploader={{true}}
          />
        </div>

        <div class="insert-video-inputs video-poster">
          <label>
            {{i18n (themePrefix "modal.poster")}}
          </label>

          <PosterUploader @setPoster={{this.setPoster}} />
        </div>

        <div class="insert-video-inputs video-subtitles">
          <label>
            {{i18n (themePrefix "modal.vtt_title")}}
          </label>

          <CustomSimpleList @values={{this.tracks}} @hasVTTUploader={{true}} />
          <div class="desc">{{i18n (themePrefix "modal.vtt_help")}}</div>
        </div>

        {{#if this.insertDisabled}}
          <div class="video-insert-error">
            {{this.validationMessage}}
          </div>
        {{/if}}
      </:body>
      <:footer>
        <DButton
          class="btn-primary"
          data-test-id="insert-video-button"
          @disabled={{this.insertDisabled}}
          @label={{themePrefix "modal.insert"}}
          @action={{this.insertVideo}}
        />
        <DButton
          class="btn-danger"
          @label={{themePrefix "modal.cancel"}}
          @action={{@closeModal}}
        />
      </:footer>
    </DModal>
  </template>
}
