<?php
$lines = file('c:/Users/Admin/Downloads/Calculadoras_Sotelo_Handover/Seguimiento/Unidades rendimiento fCH - Hoja 1.csv');
array_shift($lines);
$unit_yields = [];
foreach($lines as $l) {
    if(!trim($l)) continue;
    $row = str_getcsv($l);
    $unit = trim($row[0]);
    $yield = str_replace(',', '.', trim($row[1]));
    $unit_yields[$unit] = $yield;
}
$out = '$UNIT_YIELDS = ['."\n    ";
$c=0;
foreach($unit_yields as $u => $y) {
    $out .= "'$u' => $y, ";
    if(++$c % 6 == 0) $out .= "\n    ";
}
$out .= "\n];\n\n";

$lines2 = file('c:/Users/Admin/Downloads/Calculadoras_Sotelo_Handover/Seguimiento/rutas (1).xlsx - rutas.csv');
array_shift($lines2);
$routes = [];
foreach($lines2 as $l) {
    if(!trim($l)) continue;
    $row = str_getcsv($l);
    $orig = strtoupper(trim($row[0]));
    $dest = strtoupper(trim($row[1]));
    $km = trim($row[2]);
    $key = "$orig|$dest";
    $routes[$key] = $km;
}
$out .= '$ROUTE_DISTANCES_CLIENTS = ['."\n";
foreach($routes as $k => $v) {
    $out .= "    '$k' => $v,\n";
}
$out .= "];\n";
file_put_contents('d:/Admin/Documents/Dataholics/Sotelo/Sotelo/out.txt', $out);
