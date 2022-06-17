import Controller from "@ember/controller";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import discourseComputed from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { empty } from "@ember/object/computed";
import { isVideo } from "discourse/lib/uploads";
import { schedule } from "@ember/runloop";
import I18n from "I18n";

export default Controller.extend(ModalFunctionality, {
  sources: null,
  tracks: null,
  poster: null,

  insertDisabled: empty("sourceList"),

  keyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  },

  onShow() {
    this.setProperties({
      sources: null,
      tracks: null,
      poster: null,
    });

    schedule("afterRender", () => {
      // prevent submitting on enter while adding items to lists using Enter
      document
        .querySelector(".video-sources")
        .addEventListener("keydown", (e) => this.keyDown(e));

      document
        .querySelector(".video-subtitles")
        .addEventListener("keydown", (e) => this.keyDown(e));
    });
  },

  @discourseComputed("tracks")
  trackList(tracks) {
    if (!tracks) {
      return [];
    }

    return tracks.split("|");
  },

  @discourseComputed("sources")
  sourceList(sources) {
    if (!sources) {
      return [];
    }

    return sources.split("|");
  },

  @discourseComputed("sourceList")
  validationMessage(sourceList) {
    const allVideos = sourceList.every(
      (url) => isVideo(url) || url.endsWith(".m3u8")
    );

    return allVideos ? "" : I18n.t(themePrefix("source_not_video"));
  },

  sourceType(src) {
    let prefix, type;
    if (src.endsWith(".m3u8")) {
      prefix = "application";
      type = "x-mpegURL";
    } else {
      prefix = "video";
      type = src.substring(src.lastIndexOf(".") + 1);
    }
    return `${prefix}/${type}`;
  },

  @action
  insert() {
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
    this.toolbarEvent.addText(text);

    this.send("closeModal");
  },

  @action
  cancel() {
    this.send("closeModal");
  },

  @action
  setPoster(val) {
    this.set("poster", val);
  },
});
