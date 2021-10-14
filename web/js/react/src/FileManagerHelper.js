import axios from "axios";
const server = window.location.origin + "/file_manager/fm_api.php?";

export function validateAction(url) {
  return axios.get(url);
}

export function cacheData(currentUser, history) {
  if (localStorage.getItem("lastUser") === null || currentUser !== localStorage.getItem("lastUser")) {
    localStorage.setItem("lastUser", currentUser);
    localStorage.setItem("activeWindow", "left");
    localStorage.setItem("leftListPath", window.GLOBAL.ROOT_DIR);
    localStorage.setItem("rightListPath", window.GLOBAL.ROOT_DIR);
  }

  if (localStorage.getItem("activeWindow") === null || localStorage.getItem("leftListPath") === null || localStorage.getItem("rightListPath") === null) {
    let path = history.location.search.substring(6).split('/');
    localStorage.setItem("activeWindow", "left");
    localStorage.setItem("leftListPath", path);
    localStorage.setItem("rightListPath", window.GLOBAL.ROOT_DIR);
  }
}

export function changeDirectoryOnLoading(server, list) {
  return axios.get(`${server}dir=${encodePath(localStorage.getItem(list))}&action=cd`);
}

export function changeDirectory(server, path) {
  return axios.get(`${server}dir=${encodePath(path)}&action=cd`);
}

export function getData(path) {
  return axios.get(`${server}dir=%2F${path}&action=cd`);
}

export function checkExistingFileName(selectedFiles, activeWindow, leftListData, rightListData) {
  let selectedFileNames = [];
  let existingFileNames = [];
  let newFiles = [];

  for (let i = 0; i < selectedFiles.length; i++) {
    selectedFileNames.push(selectedFiles[i]);
  }

  if (activeWindow === "left") {
    for (let i = 0; i < selectedFileNames.length; i++) {
      if (leftListData.map((item) => { return item.name }).includes(selectedFileNames[i].name)) {
        existingFileNames.push(selectedFileNames[i]);
      } else {
        newFiles.push(selectedFileNames[i]);
      }
    }
  } else {
    for (let i = 0; i < selectedFileNames.length; i++) {
      if (rightListData.map((item) => { return item.name }).includes(selectedFileNames[i].name)) {
        existingFileNames.push(selectedFileNames[i]);
      } else {
        newFiles.push(selectedFileNames[i]);
      }
    }
  }

  return { existingFileNames, newFiles };
}

export function encodePath(path) {
  let splitPath = path.split('/');
  let encodedPath = splitPath.join('%2F');
  return encodedPath;
}

export function activeWindowPath() {
  if (localStorage.getItem("activeWindow") === "left") {
    let currentPath = localStorage.getItem("leftListPath");
    return currentPath;
  } else if (localStorage.getItem("activeWindow") === "right") {
    let currentPath = localStorage.getItem("rightListPath");
    return currentPath;
  }
}

export function deleteItems(url, path, selection) {
  if (!selection.length) {
    return false;
  }

  const promisesArray = selection.map(item =>
    validateAction(`${url}item=${path}%2F${item}&dir=${path}&action=delete_files`)
      .then(() => { })
  );

  return Promise.all(promisesArray);
}

export function moveItems(url, path, targetPath, selection) {
  if (!selection.length) {
    return false;
  }

  const promisesArray = selection.map(item =>
    validateAction(`${url}item=${path}%2F${item}&target_name=${targetPath}&action=move_file`)
      .then(() => { })
  );

  return Promise.all(promisesArray);
}

export function copyItems(url, path, targetPath, selection) {
  if (!selection.length) {
    return false;
  }

  const promisesArray = selection.map(item =>
    validateAction(`${url}item=${path}%2F${item}&filename=${item}&dir=${path}&dir_target=${targetPath}&action=copy_file`)
      .then(() => { })
  );

  return Promise.all(promisesArray);
}