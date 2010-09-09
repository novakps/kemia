from pymongo import Connection
import getopt, sys
import re



def loadPreparedFunctions(conn, files):
    db = conn.test
    p = re.compile("function (\w*)[(]")
    for file in files:
        print 'loading prepared functions in', file
        content = open(file, 'r').read()
        print db.eval(content)
        for match in p.finditer(content):
            functionName = match.group(1)
            print functionName
            command = 'db.system.js.save({_id: "%s", value: %s })' % (functionName, functionName)
            print command
            db.eval(command)

def usage():
    print "use it this way"

def main(argv):
    _debug = 0  
    try:
        opts, args = getopt.getopt(argv, "hf:d", ["help", "file="])
    except getopt.GetoptError:          
        usage()                         
        sys.exit(2)                     
    for opt, arg in opts:                
        if opt in ("-h", "--help"):      
            usage()                     
            sys.exit()                  
        elif opt == '-d':                
            print 'debug'
            _debug = 1                  
        elif opt in ("-f", "--file"): 
            filename = arg
 
    connection = Connection('localhost', 27017)
    loadPreparedFunctions(connection, [filename])

if __name__ == "__main__":
    main(sys.argv[1:])  

    

