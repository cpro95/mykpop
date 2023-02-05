import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ReactPlayer from "react-player";
import { useRecoilState } from "recoil";
import { videoState, modalState } from "~/atoms/modalAtom";

function YoutubeModal() {
  const [video, setVideo] = useRecoilState(videoState);
  const [showModal, setShowModal] = useRecoilState(modalState);

  const handleClose = () => {
    setShowModal(false);
    setVideo(null);
  };

  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        {/* 화면 전체를 어둡게 만드는 트랜지션 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-80" />
        </Transition.Child>

        {video && (
          <div className="fixed inset-0 overflow-y-auto">
            <div className="m-2 flex flex-col items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/* Dialog.Panel 이 relative로 지정됐고
              밑에 X button이 absolute로 지정되어
              alsolute의 right-0 top-0은 relative로 지정된
              Dialog.Panel을 기준으로 계산된다. */}
                <Dialog.Panel className="relative mx-auto w-full max-w-4xl transform rounded-2xl p-2 pt-8 shadow-xl transition-all md:p-8">
                  <button
                    className="absolute right-0 top-0 text-white"
                    onClick={() => handleClose()}
                  >
                    {/* This is a Close X Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 md:h-8 md:w-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* 동영상과 그 아래 설명이 있는 부분
                  아래 pt-[56.25%]로 동영상 화면 크기를 16:9로 보여주게 된다.
                  padding top을 56.25%로 한 이유는 padding top 하는 빈 공간이 바로 
                  ReactPlayer가 자리잡게 되는 방식이다.
                */}
                  <div className="relative bg-black bg-opacity-95 p-4 pt-[56.25%]">
                    <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${video?.youtubeId}`}
                      width="100%"
                      height="100%"
                      className="absolute top-0 left-0"
                      playing
                      controls
                      light={false}
                    />
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="mt-4 bg-[#181818]
                   py-4 text-lg font-medium text-white"
                  >
                    <span className="leading-6 text-dodger-200">
                      {video.youtubeTitle}
                    </span>
                    <div className="mt-5 flex flex-col items-center justify-center gap-x-3 gap-y-3 text-sm md:flex-row">
                      <div className="rounded border border-white/40 py-1 px-1.5 text-xs font-bold text-dodger-200">
                        YOUTUBE
                      </div>
                      <div className="font-light text-dodger-200">
                        {new Date(video.youtubePublishedAt).toLocaleDateString(
                          "ko-KR"
                        )}
                      </div>
                      <div className="font-semibold text-dodger-400">
                        {new Intl.NumberFormat("ko-KR", {
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(Number(video.youtubeViewCount))}{" "}
                        Views
                      </div>
                      <div className="text-dodger-200">
                        {new Intl.NumberFormat("ko-KR", {
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(Number(video.youtubeLikeCount))}{" "}
                        Likes
                      </div>
                      <div className="text-dodger-300">
                        {new Intl.NumberFormat("ko-KR", {
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(Number(video.youtubeCommentCount))}{" "}
                        Comments
                      </div>
                    </div>{" "}
                  </Dialog.Title>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        )}
      </Dialog>
    </Transition>
  );
}

export default YoutubeModal;
