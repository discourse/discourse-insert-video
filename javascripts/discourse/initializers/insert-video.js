import { withPluginApi } from "discourse/lib/plugin-api";
import InsertVideoModal from "../components/modal/insert-video";

export default {
  name: "insert-video",
  initialize() {
    withPluginApi((api) => {
      api.onToolbarCreate((toolbar) => {
        let currentUser = api.getCurrentUser();

        if (settings.only_available_to_staff && !currentUser.staff) {
          return;
        }

        toolbar.addButton({
          title: themePrefix("composer_title"),
          id: "insertVideo",
          group: "insertions",
          icon: "video",
          perform: (e) => {
            api.container.lookup("service:modal").show(InsertVideoModal, {
              model: { toolbarEvent: e },
            });
          },
        });
      });

      if (settings.text_tracks_as_blobs) {
        api.decorateCooked(processVideos, {
          onlyStream: true,
          id: "discourse-insert-video-tracks",
        });
      }

      api.decorateCookedElement(processOverlay, {
        onlyStream: false,
        id: "custom-video-overlay-element",
      });

      function processOverlay(post) {
        if (settings.disable_download) {
          post.querySelectorAll("video").forEach((video) => {
            video.addEventListener("contextmenu", (e) => e.preventDefault());
          });
        }
      }

      function processVideos($elem) {
        let v = $elem[0].querySelectorAll("video");

        if (v.length === 0) {
          return;
        }

        v.forEach((video) => {
          const tracks = video.querySelectorAll("track");
          tracks.forEach((track) => {
            const src = track.getAttribute("src");

            let xhr = new XMLHttpRequest();
            xhr.open("GET", src, true);
            xhr.responseType = "arraybuffer";
            xhr.addEventListener("load", function () {
              if (xhr.status === 200) {
                const url = URL.createObjectURL(new Blob([xhr.response]));
                track.src = url;
              }
            });
            xhr.send();
          });
        });
      }
    });
  },
};
