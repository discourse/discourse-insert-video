# frozen_string_literal: true

require "#{Rails.root}/spec/system/page_objects/modals/base"

module PageObjects
  module Modals
    class InsertVideo < PageObjects::Modals::Base
      BODY_SELECTOR = ".insert-video"
      MODAL_SELECTOR = ".insert-video-modal"
      def click_add_video_source_button
        find(".video-sources .simple-list-uploader .btn").click
      end

      def click_add_poster_button
        find(".video-poster .simple-list-uploader .btn").click
      end

      def click_add_subtitle_button
        find(".video-subtitles .simple-list-uploader .btn").click
      end

      def click_primary_button
        find(".modal-footer .btn-primary").click
      end
    end
  end
end