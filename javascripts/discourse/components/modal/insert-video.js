import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { empty } from "@ember/object/computed";
import { service } from "@ember/service";
import { isVideo } from "discourse/lib/uploads";
import I18n from "I18n";

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

    return allVideos ? "" : I18n.t(themePrefix("source_not_video"));
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
    const text = `<video controls ${controlslist} preload="metadata"${poster}>${sources}${tracks}\n</video>`;
    this.args.model.toolbarEvent.addText(text);
    this.appEvents.trigger("discourse-insert-video:video-inserted", text);
    this.args.closeModal();
  }

  @action
  setPoster(val) {
    this.poster = val;
  }
}
