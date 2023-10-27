(() => {
  const passport__screen = document.querySelector(".passport__screen");
  const fallback_img = document.querySelector(".fallback_img");
  const user__name = document.querySelector("#user__name");
  const img = document.querySelector(".img");
  const edit_btn = document.querySelector(".edit_btn");
  const download_btn = document.querySelector("#download_btn");
  let camera__screen,
    video,
    shutter_btn,
    retake_btn,
    close_btn,
    name_input,
    save_btn;

  if (JSON.parse(localStorage.getItem("camera"))) {
    img.setAttribute("src", JSON.parse(localStorage.getItem("camera")));
    img.style.transform = "rotate(91deg)";
    img.style.top = "20px";
    edit_btn.style.left = "122px";
  } else {
    img.setAttribute("src", `./assets/profile photo.png`);
  }

  function appendCamera() {
    camera__screen = document.createElement("div");
    video = document.createElement("video");
    const camera__btns = document.createElement("div");

    shutter_btn = document.createElement("img");
    retake_btn = document.createElement("img");
    close_btn = document.createElement("img");

    name_input = document.createElement("input");
    save_btn = document.createElement("button");

    shutter_btn.setAttribute("id", "shutter_btn");
    shutter_btn.setAttribute("src", "./assets/shutter button.png");
    shutter_btn.setAttribute("alt", "shutter button");

    retake_btn.setAttribute("id", "retake_btn");
    retake_btn.setAttribute("src", "./assets/retake button.png");
    retake_btn.setAttribute("alt", "retake button");

    close_btn.setAttribute("id", "close_btn");
    close_btn.setAttribute("src", "./assets/close-btn.png");
    close_btn.setAttribute("alt", "close button");

    camera__btns.setAttribute("class", "camera__btns");
    camera__btns.append(shutter_btn);
    camera__btns.append(retake_btn);
    camera__btns.append(close_btn);

    video.setAttribute("class", "camera");
    video.setAttribute("height", "480");
    video.setAttribute("width", "480");

    name_input.setAttribute("class", "name_input");
    name_input.setAttribute("placeholder", "Enter your first name");

    save_btn.setAttribute("class", "save_btn");
    save_btn.textContent = "Save";

    camera__screen.setAttribute("class", "camera__screen");
    camera__screen.append(video);
    camera__screen.append(camera__btns);
    camera__screen.append(name_input);
    camera__screen.append(save_btn);

    camera__screen.style.display = "flex";

    document.body.append(camera__screen);
  }

  const openCameraPage = () => {
    passport__screen.style.display = "none";
    appendCamera();
    startCamera();
    close_btn.addEventListener("click", closeCameraPage);
    shutter_btn.addEventListener("click", captureImage);
    retake_btn.addEventListener("click", () => {
      document.body.removeChild(camera__screen);
      openCameraPage();
    });

    save_btn.addEventListener("click", saveData);
  };

  function closeCameraPage() {
    stopCamera();
    document.body.removeChild(camera__screen);
    passport__screen.style.display = "block";
  }

  function startCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 320, height: 320 }, audio: false })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (error) {
        console.error("Error accessing the camera: " + error);
      });
  }

  function stopCamera() {
    if (video.srcObject) {
      let stream = video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  }

  function captureImage() {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");

    localStorage.setItem("camera", JSON.stringify(imageData));

    const capture = document.createElement("div");
    const capturedImg = document.createElement("img");

    capture.setAttribute("class", "capture");

    capturedImg.setAttribute("src", `${imageData}`);
    capturedImg.setAttribute("width", `${canvas.width}`);

    capture.append(capturedImg);

    stopCamera();

    camera__screen.removeChild(video);
    camera__screen.prepend(capture);

    shutter_btn.style.visibility = "hidden";
    retake_btn.style.visibility = "visible";
  }

  function saveData() {
    closeCameraPage();
    if (
      name_input.value.trim() != "" &&
      /^[A-Za-z]{1,30}$/.test(name_input.value)
    ) {
      localStorage.setItem("name", name_input.value);
    } else {
      alert(
        "Please enter a valid name containing only letters and not exceeding 30 characters."
      );
    }

    user__name.textContent = localStorage.getItem("name") || "Name";

    if (JSON.parse(localStorage.getItem("camera"))) {
      img.setAttribute("src", JSON.parse(localStorage.getItem("camera")));
      img.style.transform = "rotate(91deg)";
      img.style.top = "20px";
      edit_btn.style.left = "122px";
    }
  }

  fallback_img.addEventListener("click", openCameraPage);

  download_btn.addEventListener("click", function () {
    const elementToCapture = passport__screen;

    const clonedElement = elementToCapture.cloneNode(true);
    clonedElement.setAttribute("class", "clone");

    const cloned_icons = clonedElement.querySelector(".icons");
    const cloned_download_btn = clonedElement.querySelector("#download_btn");

    const elementsToExclude = [cloned_icons, cloned_download_btn];

    elementsToExclude.forEach(function (element) {
      element.style.visibility = "hidden";
    });

    document.body.appendChild(clonedElement);

    html2canvas(clonedElement).then(function (canvas) {
      //   elementsToExclude.forEach(function(element) {
      //     element.style.display = 'visible';
      // });

      clonedElement.remove();
      const dataURL = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = dataURL;
      downloadLink.download = "snapshot.png";

      downloadLink.click();
    });
  });
})();
