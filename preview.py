import sys
import spotipy
import spotipy.util as util
import string
import csv
import pymysql
import requests
import time
import re
import unicodedata
import math
import string
import json
from pprint import pprint

import urllib


reload(sys)
sys.setdefaultencoding("utf-8")

# conn = pymysql.connect(host='127.0.0.1', unix_socket='/Applications/MAMP/tmp/mysql/mysql.sock', user='root', passwd='root', db='pandora', charset='utf8')
#

# export SPOTIPY_CLIENT_ID='e5d3592c12cd45889d547046f5344866'
# export SPOTIPY_CLIENT_SECRET='6b086cc96d7a491eb6e9183b7e31bd6c'
# export SPOTIPY_REDIRECT_URI='https://pudding.cool'
#
scope = 'user-library-read'
util.prompt_for_user_token('mfdaniels',scope,client_id='e5d3592c12cd45889d547046f5344866',client_secret='6b086cc96d7a491eb6e9183b7e31bd6c',redirect_uri='localhost:8888/callback')

if len(sys.argv) > 1:
    username = sys.argv[1]
else:
    print "Usage: %s username" % (sys.argv[0],)
    sys.exit()

token = util.prompt_for_user_token(username, scope)
print token
if token:
    with open('/Applications/MAMP/htdocs/falsetto-site/data-analysis/output.csv', 'a') as csvfile:
        writer = csv.writer(csvfile, delimiter=',',
                                quotechar='|', quoting=csv.QUOTE_MINIMAL)

        file = open('/Applications/MAMP/htdocs/falsetto-site/data-analysis/w_spotify_id.csv', "rb")
        reader = csv.reader(file, delimiter=',')

        next(reader) # skip header
        for index, row in enumerate(reader):
            # if(row[0] == "The Ames BrothersNo One But You (In My Heart)"):
            #     print index
            sp = spotipy.Spotify(auth=token)
            if index > 21183:
                artist_title = row[0]
                artist_name = ""
                track_name = ""
                searched = False
                preview_url = ""
                spotify_id = row[3]
                if len(row[3]) > 5:
                    print "using andrews ids"
                    track = sp.track(row[3])
                    preview_url = "none"
                    if track["preview_url"]:
                        preview_url = track["preview_url"].replace("https://p.scdn.co/mp3-preview/","")
                else:
                    track_id = sp.search(q="artist:"+row[1]+" track:"+row[2], limit=50, type='track')
                    if track_id["tracks"]["total"] == 0:
                        print "no result on artist and track colons"
                        artist_search = row[1].translate(None, string.punctuation)
                        track_search = row[2].translate(None, string.punctuation)
                        q = artist_search+" "+track_search
                        track_id = sp.search(q=q, type='track')
                        if track_id["tracks"]["total"] == 0:
                            artist_search = artist_search.lower().split("feat")[0]
                            q = artist_search+" "+track_search
                            track_id = sp.search(q=q, type='track')
                            for track in track_id["tracks"]["items"]:
                                if(track["preview_url"]):
                                    print "found url"
                                    if "karaoke" in track["artists"][0]["name"].lower():
                                        print "3 found karaoke"
                                    elif "karaoke" in track["name"].lower():
                                        print "3 found karaoke"
                                    elif "version" in track["name"].lower():
                                        print "found version"
                                    elif "original" in track["name"].lower():
                                        print "found original"
                                    else:
                                        print track_name.lower()
                                        track_name = track["name"]
                                        artist_name = track["artists"][0]["name"]
                                        preview_url = track["preview_url"].replace("https://p.scdn.co/mp3-preview/","")
                                        searched = True
                                        break
                                    searched = True
                                else:
                                    print "no preview"
                        else:
                            print "found results"
                            for track in track_id["tracks"]["items"]:
                                if(track["preview_url"]):
                                    print artist_name
                                    print "found url"
                                    if "karaoke" in track["artists"][0]["name"].lower():
                                        print "0 found karaoke"
                                    elif "karaoke" in track["name"].lower():
                                        print "0 found karaoke"
                                    elif "version" in track["name"].lower():
                                        print "found version"
                                    elif "original" in track["name"].lower():
                                        print "found original"
                                    else:
                                        print track_name.lower()
                                        print "found thing!!!!!"
                                        track_name = track["name"]
                                        artist_name = track["artists"][0]["name"]
                                        preview_url = track["preview_url"].replace("https://p.scdn.co/mp3-preview/","")
                                        searched = True
                                        break
                                else:
                                    print "no preview"
                    if preview_url == "":
                        for track in track_id["tracks"]["items"]:
                            print "looking here"
                            if(track["preview_url"]):
                                print track["preview_url"]
                                print artist_name
                                searched = True
                                print track_name.lower() + "hi"
                                if "karaoke" in track["artists"][0]["name"].lower():
                                    print "1 found karaoke"
                                elif "karaoke" in track["name"].lower():
                                    print "2 found karaoke"
                                else:
                                    print "1 found url"
                                    track_name = track["name"]
                                    artist_name = track["artists"][0]["name"]
                                    preview_url = track["preview_url"].replace("https://p.scdn.co/mp3-preview/","")
                                    searched = True
                                    break
                            else:
                                print "no preview here hi"
                            if preview_url == "":
                                print "trying again"
                                artist_search = row[1].translate(None, string.punctuation)
                                track_search = row[2].translate(None, string.punctuation)
                                q = artist_search+" "+track_search
                                track_id = sp.search(q=q,type='track')
                                for track in track_id["tracks"]["items"]:
                                    if(track["preview_url"]):
                                        if "karaoke" in track["artists"][0]["name"].lower():
                                            print "4 found karaoke here"
                                        elif "karaoke" in track["name"].lower():
                                            print "4 found karaoke heree"
                                        else:
                                            print "found url hereee"
                                            track_name = track["name"]
                                            artist_name = track["artists"][0]["name"]
                                            print artist_name
                                            preview_url = track["preview_url"].replace("https://p.scdn.co/mp3-preview/","")
                                            searched = True
                                            break
                                    else:
                                        print "no preview"
                    print "$$$"
                    print row[0]
                    print artist_name
                    print track_name
                    print preview_url
                writer.writerow([artist_name,track_name,preview_url,artist_title,spotify_id])











else:
    print "Can't get token for", username
