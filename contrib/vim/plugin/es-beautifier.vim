if exists('g:loaded_esBeautifier')
  finish
endif
let g:loaded_esBeautifier = 1

let s:cli_path = expand('<sfile>:p:h:h:h:h').'/lib/cli.js'

function! ExecEsBeautifier(first, last)
  let content = getline(a:first, a:last)
  let result = system(s:cli_path, content)
  let lines = split(result, "\n")
  if len(lines)
    silent exec a:first.','.a:last.'j'
    call setline(a:first, lines[0])
    call append(a:last, lines[1:])
  endif
  return result
endfunction

function! RangeEsBeautifier() range
  return ExecEsBeautifier(a:firstline, a:lastline)
endfunction

function! EsBeautifier()
  return ExecEsBeautifier('1', '$')
endfunction
