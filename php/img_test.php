<?php
if (isset($_POST['imgName'])){
    $filename = $_POST["imgName"];
    $base64 = $_POST["base64"];
    //echo $base64;
    //echo json_encode($base64);

    if(strstr($base64, ',')){
        $base64 = explode(',', $base64);
        $base64 = $base64[1];
    }
    
    //TODO: 路径更改；大小处理（如果不能就算了
    $fp= fopen("../image/".$filename, "w");
    $len = fwrite($fp, base64_decode($base64));
    fclose($fp);
    echo $len .'字节被写入了\n';
    // if(strstr($photo, ',')){
    //     $photo = explode(',', $photo);
    //     $photo = $photo[1];
    // }
}