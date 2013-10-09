
# ---------------------------------------- #
#
#  REQUIREMENTS:
#  This script will only work inside this repo. For other repos, it might
#  require some code changes. git has to have set default upstream
#
#  HOW TO CONFIGURE:
#  0. If this is ez_default, copy this file to one called ez.sh. 
#     Configure that one instead of this one.
#  1. in terminal, write
#     alias ez="sh <path to this file>" 
#  2. change port variable to your port (82: tintin, 83: pawan, 84: tina)
port=81
#  3. set configured to 1
configured=0
#
#  HOW TO USE:
#  ez commit <message>
#       will commit to repository
#  ez pull 
#       will get latest version from repository
#  ez push
#       will push your commits to server
#  ez env
#       will activate environment if not activated
#  ez sync
#       will sync datamodel changes to database. 
#       This might still be buggy
#
# ---------------------------------------- #


# If not configured, don't run
if [ "$configured" = "0" ]; then
    echo ""
    echo "Please configure this file using a text editor.";
    echo "It can be found in: "
    pwd
    echo ""
    exit 0;
fi

if [ "$1" = "start" ]; then
    sudo python wellvis/manage.py runserver 0.0.0.0:$port
    exit 0;
fi

if [ "$1" = "commit" ]; then
    if [ "$2" ]; then
        git commit -a -m "$2"
        exit 0;
    fi
    echo "Please provide a message with your commit. Remember to include [#TASKID]";
    exit 0;
fi

if [ "$1" = "env" ]; then
    echo "To activate env, please type source env/bin/activate when standing in:"
    pwd
    exit 0;
fi

if [ "$1" = "push" ]; then
    git push
    exit 0;
fi

if [ "$1" = "pull" ]; then
    git pull
    exit 0;
fi

if [ "$1" = "sync" ]; then
    python wellvis/manage.py syncdb
    exit 0;
fi

echo  "HOW TO USE:";
echo  "ez commit <message>";
echo  "     will commit to repository. Remember to include [#TASKID] in message";
echo  "ez pull [repository] [branch]";
echo  "     will get latest version from repository. If repository and branch is omitted, it will use default stream.";
echo  "ez push [repository] [branch]";
echo  "     will push your commits to origin master. If repository and branch is omitted, it will use default stream.";
echo  "ez env";
echo  "     will tell you how to activate env (cannot be simplified properly)";
echo  "ez sync";
echo  "     will sync datamodel changes to database.";
echo  "ez start";
echo  "     will start the server.";
exit 0;
