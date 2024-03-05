document.addEventListener("DOMContentLoaded", function () {
  // Get all the report buttons
  const reportButtons = document.querySelectorAll(".report-icon");

  // Add event listener to each report button
  reportButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Get the parent div of the clicked image
      const parentDiv = event.target.parentElement;

      // Get the report form within the parent div
      const reportForm = parentDiv.querySelector(".report-form");

      // Toggle the report form's visibility
      reportForm.classList.toggle("visible");
    });
  });

  // Get all the delete buttons
  const deleteButtons = document.querySelectorAll(".post-delete");

  // Add event listener to each delete button
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Prevent the default action
      event.preventDefault();

      // Show the confirmation dialog
      const confirmation = confirm(
        "Are you sure you want to delete this post?"
      );

      // If the user confirms, redirect to the delete URL
      if (confirmation) {
        window.location = event.target.parentElement.href;
      }
    });
  });

  window.onload = function () {
    const menuButtons = document.querySelectorAll(".menu-button");
    const currentUrl = window.location.pathname; // Get the relative path
    console.log(currentUrl);

    menuButtons.forEach((button) => {
      if (button.getAttribute("href") === currentUrl) {
        button.classList.add("menu-button-active");
      } else if (button.classList.contains("menu-button-active")) {
        button.classList.remove("menu-button-active");
      }
    });
  };
  var expandButtons = document.querySelectorAll(".expand-button");

  expandButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var text = this.parentElement.querySelector(".post-text.expandable");
      text.classList.toggle("expanded");
      var post = this.parentElement.parentElement;
      post.classList.toggle("extended");

      // Change the text of the expand button
      if (text.classList.contains("expanded")) {
        button.textContent = "Collapse";
      } else {
        button.textContent = "Read more";
      }
    });
  });
  // hide expand button if post is short
  var posts = document.querySelectorAll(".post-text");
  var expandButtons = document.querySelectorAll(".expand-button");

  if (posts.length > 0 && expandButtons.length > 0) {
    posts.forEach(function (post) {
      if (post.clientHeight < post.scrollHeight) {
        expandButtons.forEach(function (button) {
          button.classList.remove("hidden");
        });
      }
    });
  }

  var postContainers = document.querySelectorAll(".post-container");

  postContainers.forEach(function (container) {
    var post = container.querySelector(".post-text");
    var button = container.querySelector(".expand-button");

    if (post.clientHeight < post.scrollHeight) {
      button.classList.remove("hidden");
    }
  });

  document.querySelector(".menu-toggle").addEventListener("click", function () {
    document.querySelector(".menu-container").classList.toggle("show");
    document.querySelector(".menu-toggle").classList.toggle("active");
  });
});
