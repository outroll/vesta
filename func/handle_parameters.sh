# handle --parameters=val
handle_parameter() {
    origparam=$1
    searchstring="="
    paramminuses=${origparam:0:2}
    if [ "$paramminuses" = "--" ]; then
        var_without_minuses=${origparam:2}
        var=${var_without_minuses%%=*}
        val=${origparam#*$searchstring}
        #echo $var
        #echo $val
        printf -v "$var" '%s' "$val"
    fi
}
numargs=$#
for ((i=1 ; i <= numargs ; i++))
do
    handle_parameter $1
    shift
done
