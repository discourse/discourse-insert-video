import Controller from "@ember/controller";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import discourseComputed from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { isVideo } from "discourse/lib/uploads";
import { run } from "@ember/runloop";
import I18n from "I18n";

export default Controller.extend(ModalFunctionality, {
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
      validationMessage: null,
      poster: null,
    });

    run.schedule("afterRender", () => {
      // prevent submitting on enter while adding items to lists using Enter
      document
        .querySelector(".video-sources")
        .addEventListener("keydown", (e) => this.keyDown(e));

      document
        .querySelector(".video-subtitles")
        .addEventListener("keydown", (e) => this.keyDown(e));
    });
  },

  @discourseComputed
  insertDisabled() {
    let data = this.prepData();
    return !data.sources;
  },

  prepData() {
    const { sources, tracks } = this;
    let data = {};

    if (sources) {
      const srcArray = sources.split("|");

      if (
        !srcArray.every((url) => {
          return isVideo(url) || url.endsWith(".m3u8");
        })
      ) {
        this.set("validationMessage", I18n.t(themePrefix("source_not_video")));
        return false;
      }
      data.sources = srcArray;
    }

    if (tracks) {
      const tracksArray = tracks.split("|");
      data.tracks = tracksArray;
    }

    this.set("validationMessage", null);
    return data;
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
    const data = this.prepData();
    let sources = "",
      tracks = "";
    const poster = this.poster ? `poster="${this.poster}"` : "";

    data.sources.forEach((src) => {
      sources += `\n  <source src="${src}" type="${this.sourceType(src)}" />`;
    });

    const controlslist =
      settings && settings.disable_download ? `controlslist="nodownload" ` : "";

    if (data.tracks) {
      data.tracks.forEach((t, i) => {
        const track = t.split(","),
          url = track[0],
          label = track[1] || "English",
          langcode = track[2] || "en",
          def = i === 0 ? "default " : "";

        tracks += `\n  <track src="${url}" label="${label}" kind="subtitles" srclang="${langcode}" ${def}/>`;
      });
    }
    let text = `<video controls ${controlslist} preload="metadata" ${poster}>${sources}${tracks}\n</video>`;
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
