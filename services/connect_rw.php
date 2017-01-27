<?php
#connect
$url = parse_url(getenv('DATABASE_URL'));
  $host = $url["host"];
  $user = $url["user"];
  $pass = $url["pass"];
  $db =substr($url["path"],1);
$conn_string = "host=".$host." port=5432 dbname=".$db." user=".$user." password=".$pass;
$con = pg_connect($conn_string);
?> 