import { withPluginApi } from "discourse/lib/plugin-api";
import showModal from "discourse/lib/show-modal";

function playTriggered(el) {
  console.log("play triggered");
  console.log(el);
}

export default {
  name: "insert-video",

  initialize() {
    withPluginApi("0.8.31", api => {
      api.onToolbarCreate(toolbar => {
        let currentUser = api.getCurrentUser();

        if (settings.only_available_to_staff && !currentUser.staff) {
          return;
        }

        toolbar.addButton({
          title: themePrefix("composer_title"),
          id: "insertVideo",
          group: "insertions",
          icon: "video",
          perform: e =>
            showModal("insert-video").setProperties({ toolbarEvent: e })
        });
      });

      api.decorateCooked(processVideos, {
        onlyStream: true,
        id: "discourse-insert-video"
      });

      function processVideos($elem, helper) {
        let v = $elem[0].querySelectorAll("video");

        if (v.length === 0) {
          return;
        }

        v.forEach(video => {
          console.log(video);
          const tracks = video.querySelectorAll("track");
          tracks.forEach(track => {
            const src = track.getAttribute("src");
            console.log(src);

            var xhr = new XMLHttpRequest();
            xhr.open("GET", src, true);
            xhr.responseType = "arraybuffer";
            xhr.addEventListener("load", function() {
              if (xhr.status === 200) {
                console.log(xhr.response); // ArrayBuffer
                console.log(new Blob([xhr.response])); // Blob
                const url = URL.createObjectURL(new Blob([xhr.response]));
                console.log(url);
                track.setAttribute("src", url);
              }
            });
            xhr.send();
          });
        });
      }
    });
  }
};
