select e.*
	from (
	select c.peak_rank, c.points, c.year, substring_index(preview_url,"?",1) as preview_url,c.artist_name, c.song_title, c.initial_match, d.*
	from (
		select a.initial_match, a.pandora_id, if(a.initial_match = "True",a.title,a.title) as song_title, if(a.initial_match = "True",a.artist,a.artist) as artist_name, b.*
		from (

			select y.*, x.preview_url
			from (
				select artist_title, sum((101-current_rank)) as points, min(current_rank) as peak_rank, min(left(chart_date, 4)) as year from 	billboard_all_time
				group by 1
			) y
			left join (
				select artist_title, max(preview_url) as preview_url
				from preview_scrape
				where preview_url <> ""
				group by 1
			) x
			on y.artist_title = x.artist_title


		) b

		left join (
			select artist_title, pandora_id, song_title_pandora, artist_name_pandora, artist, title, initial_match
			from total_scraped
			group by 1,2,3,4,5,6

		) a
		on b.artist_title = a.artist_title
) c
	left join (
		select falsetto, gender, register, genre, spoken, pandora_id
		from matched_from_pandora
		group by 1,2,3,4,5,6
	) d
	on c.pandora_id = d.pandora_id
) e
order by year
