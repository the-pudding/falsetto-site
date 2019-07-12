select e.*, f.preview_url
	from (
	select c.peak_rank, c.points, c.year, c.artist_name, c.song_title, c.initial_match, d.*
	from (
		select a.initial_match, a.pandora_id, if(a.initial_match = "True",a.song_title_pandora,a.title) as song_title, if(a.initial_match = "True",a.artist_name_pandora,a.artist) as artist_name, b.*
		from (
			select artist_title, pandora_id, song_title_pandora, artist_name_pandora, artist, title, initial_match
			from total_scraped
			group by 1,2,3,4,5,6
		) a
		join (
			select artist_title, sum((101-current_rank)) as points, min(current_rank) as peak_rank, min(left(chart_year, 4)) as year from billboard_all_time
			group by 1
		) b
		on a.artist_title = b.artist_title
	) c
	left join (
		select falsetto, gender, register, genre, spoken, pandora_id
		from matched_from_pandora
		group by 1,2,3,4,5,6
	) d
	on c.pandora_id = d.pandora_id
	having year < 2019
) e
left join (
	select pandora_id, min(preview_url) as preview_url, min(title) as title, min(artist) as artist
	from preview_izii
	where initial_match = "True"
	and preview_url <> ""
	group by 1
) f
on e.pandora_id = f.pandora_id
group by 1,2,3,4,5,6,7,8,9,10,11,12,13
order by year
