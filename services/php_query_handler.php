<?php
include("connect_rw.php");
$query = $_GET["query"];
$data_query = file_get_contents($query);

foreach ($_GET as $key => $value)
	$data_query = str_replace('${'.$key.'}$',$value,$data_query);
$data_result = pg_query($con, $data_query) or die;
$data = array();
while ($data_row = pg_fetch_assoc($data_result)) {
  $data[] = $data_row;
}
echo json_encode($data);
?>