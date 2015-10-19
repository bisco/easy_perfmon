console.log("child start");

process.on("message", function (msg) {
  console.log(msg);

  setTimeout(function() {
    process.send({ message: "from child!" });
  }, 1000);
});

process.on("exit", function () {
  console.log("child exit");
});
