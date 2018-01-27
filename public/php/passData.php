<?php
  $packed = $_POST['data'];
  $data = split(",", $packed);
  for ($i = 0; ($i < count($data)); $i++) {
    # Undo what JavaScript's escape() function did
    $data[$i] = rawurldecode($data[$i]);
    # Slashes need escaping when they appear in code
    $data[$i] = str_replace("\\", "\\\\", $data[$i]);
    # Quotes need escaping too
    $data[$i] = str_replace("\"", "\\\"", $data[$i]);
  }
?>

<script>
  var data = new Array (
<?php
  for ($i = 0; ($i < count($data)); $i++) {
    if ($i > 0) {
      echo ",\n";
    }
    echo "    \"";
    echo $data[$i];
    echo "\"";
  }
?>

  );
</script>
