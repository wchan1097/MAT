$("#add").submit((event) => {
  event.preventDefault();
  var mediaElements = event.target.elements;
  var mediaType = mediaElements["type"].value;
  var media = {
    type: mediaType,
    title: mediaElements["title"].value,
    [(mediaType == "anime") ? "episode" : "chapter"] : mediaElements["currentIndex"].value,
    [(mediaType == "anime") ? "season" : "book"] : mediaElements["currentSeason"].value,
    language: mediaElements["media_lang"].value
  }
  $("#title").val("");
  $("#currentIndex").val(1);
  $("#currentSeason").val(1);
  $.get("/add", media, data => {
    console.log(data);
  })
})