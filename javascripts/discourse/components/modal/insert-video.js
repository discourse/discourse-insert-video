import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { empty } from "@ember/object/computed";
import { isVideo } from "discourse/lib/uploads";
import { afterRender } from "discourse-common/utils/decorators";
import I18n from "I18n";

export default class InsertVideoModal extends Component {
  @tracked sources;
  @tracked tracks;
  @tracked poster;

  _keyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
  @afterRender
  _preventSubmit() {
    // prevent submitting on enter while adding items to lists using Enter
    document
      .querySelector(".video-sources")
      .addEventListener("keydown", (e) => this._keyDown(e));

    document
      .querySelector(".video-subtitles")
      .addEventListener("keydown", (e) => this._keyDown(e));
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

  get insertDisabled() {
    return empty(this.sourceList);
  }

  get validationMessage() {
    const allVideos = this.sourceList.every(
      (url) => isVideo(url) || url.endsWith(".m3u8")
    );

    return allVideos ? "" : I18n.t(themePrefix("source_not_video"));
  }

  get sourceType() {
    let prefix, type;
    if (this.src.endsWith(".m3u8")) {
      prefix = "application";
      type = "x-mpegURL";
    } else {
      prefix = "video";
      type = this.src.substring(this.src.lastIndexOf(".") + 1);
    }
    return `${prefix}/${type}`;
  }

  get callback() {
    return () => {
      // this.sources.add(src);
    };
  }

  @action
  insertVideo() {
    let sources = "";
    let tracks = "";

    this.sourceList.forEach((src) => {
      sources += `\n  <source src="${src}" type="${this.sourceType(src)}" />`;
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

    this.args.closeModal();
  }

  @action
  setPoster(val) {
    this.poster = val;
  }
}
